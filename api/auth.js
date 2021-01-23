
const express = require("express");
const app = express();
const passport = require('passport');

const axios = require("../server/axios").axios;
const LocalStrategy = require('passport-local').Strategy;
const { CONST } = require('../const.js');

const logger = require("../server/logger").logger;

app.use(function (req, res, next) {
	logger.debug('[Express] START TIME:', Date.now());
	logger.debug("[Express] METHOD: ", req.method, "URL: ", req.url);
	next()
});

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

passport.use('local', new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password'
}, function (username, password, done) {
	axios.post(`/user/login`, { account: username, password: password }).then(function (response) {
		let user = response.data;
		if (!user || !user.organization) {
			return done(null, false, { message: 'ユーザーIDもしくはパスワードが正しくありません。' })
		}
		if (user.organization.organization_type !== CONST.organization_type.HOSPITAL.value) {
			return done(null, false, { message: 'ユーザーIDもしくはパスワードが正しくありません。' })
		}
		return done(null, {
			user_id: user.user_id,
			organization_id: user.organization_id,
			organization_name: user.organization.organization_name,
			email: user.email,
			organization_type: user.organization.organization_type
		});
	}).catch(function (error) {
		return done(error)
	});
}))

app.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			return next(err)
		}
		if (!user.user_id) {
			return res.status(401).send(info)
		}
		req.login(user, (err) => {
			if (err) {
				return next(err)
			}
			return res.status(200).json(user)
		})
	})(req, res, next)
})

app.get('/logout', (req, res) => {
	req.session.destroy(function (err) {
		req.logout()
		res.status(200).send()
	});
})

app.get('/me', checkAuthentication, (req, res) => {
	return res.status(200).json(req.user)
})

function checkAuthentication (req, res, next) {
	if (req.isAuthenticated()) {
		next()
	} else {
		res.status(204).send()
	}
}

module.exports = {
	path: "/api/auth/",
	handler: app
};
