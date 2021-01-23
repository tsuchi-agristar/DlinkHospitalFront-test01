const express = require('express');
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');
const passport = require('passport');
const expressSession = require("express-session");
const resolve = require('path').resolve;
const rootDir = resolve('.');
const config = require(resolve(rootDir, 'config'));

const app = express();


app.use(express.json())
app.use(express.urlencoded({
	extended: true
}));


const { db } = require(resolve(rootDir, 'models/session'));
// set up session middleware
app.use(expressSession({
	secret: 'secret',
	cookie: {
		maxAge: config.mongoDBSessionMaxAge * 1000,
		sameSite: 'lax',
		// secure: true
	},
	store: db,
	resave: false, // we support the touch method so per the express-session docs this should be set to false
	// rolling: true, //スライディングしない
	saveUninitialized: false
}))
db.sync();// Initialize Passport!  Also use passport.session() middleware, to support
app.use(passport.initialize());
app.use(passport.session());

// Import and Set Nuxt.js options
const nuxtConfig = require('./nuxt.config.js')
nuxtConfig.dev = process.env.NODE_ENV !== 'production'

async function start () {
	// Init Nuxt.js
	const nuxt = new Nuxt(nuxtConfig)

	const {
		host,
		port
	} = nuxt.options.server

	// Build only in dev mode
	if (nuxtConfig.dev) {
		const builder = new Builder(nuxt)
		await builder.build()
	} else {
		await nuxt.ready()
	}

	// Give nuxt middleware to express
	app.use(nuxt.render)

	// Listen the server
	app.listen(port, host)
	consola.ready({
		message: `Server listening on http://${host}:${port}`,
		badge: true
	})
}
start()
