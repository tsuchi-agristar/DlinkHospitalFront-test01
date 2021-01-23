require('dotenv').config();
import { CONST } from '../const.js';
import _ from 'lodash';
import dayjs from 'dayjs';
const uuidv4 = require('uuid/v4');
const express = require("express");
const app = express();

app.use(express.json())
app.use(express.urlencoded({
	extended: true
}));

const logger = require("../server/logger").logger;
const axiosBase = require("../server/axios").axiosBase;
const axios = require("../server/axios").axios;

app.use(function (req, res, next) {
	logger.debug('[Express] START TIME:', Date.now());
	logger.debug("[Express] METHOD: ", req.method, "URL: ", req.url);
	next()
});

app.get("/profile", function (req, res, next) {

	axiosBase.all([
		axios.get(`/organization/${req.session.passport.user.organization_id}`),
		axios.get(`/hospital/${req.session.passport.user.organization_id}`),
		axios.get(`/organization/${req.session.passport.user.organization_id}/user`)
	]).then(axiosBase.spread((res1, res2, res3) => {
		let resData = {
			organization_id: _.get(res1, 'data.organization_id'),
			organization_name: _.get(res1, 'data.organization_name'),
			organization_name_kana: _.get(res1, 'data.organization_name_kana'),
			prefecture: _.get(res1, 'data.prefecture'),
			city: _.get(res1, 'data.city'),
			address: _.get(res1, 'data.address'),
			mail_address: _.get(res3, 'data.mail_address'),
			homepage: _.get(res1, 'data.homepage'),
			hospital_id: _.get(res2, 'data.hospital_id'),
			hospital_type: _.get(res2, 'data.hospital_type'),
			user_id: _.get(res3, 'data.user_id'),
		};
		res.send(resData);
	})).catch(function (error) {
		next(error);
	});
});

app.put("/profile", function (req, res, next) {
	let organization = {
		"organization_name": req.body.organization_name,
		"organization_name_kana": req.body.organization_name_kana,
		"prefecture": req.body.prefecture,
		"city": req.body.city,
		"address": req.body.address,
		"homepage": req.body.homepage,
	};
	let hospital = {
		"hospital_id": req.body.organization_id,
		"hospital_type": req.body.hospital_type,
	};
	let user = {
		"user_id": req.body.user_id,
		"organization_id": req.body.organization_id,
		"mail_address": req.body.mail_address,
	};
	axiosBase.all([
		axios.put(`/organization/${req.body.organization_id}`, _.omitBy(organization, _.isNil)),
		axios.put(`/hospital/${req.body.organization_id}`, _.omitBy(hospital, _.isNil)),
		axios.put(`/user/${req.body.user_id}`, _.omitBy(user, _.isNil))
	]).then(axiosBase.spread((res1, res2, res3) => {
		res.end();
	})).catch(function (error) {
		next(error);
	});
});

app.get("/profile/password", function (req, res, next) {

	axiosBase.all([
		axios.get(`/organization/${req.session.passport.user.organization_id}/user`)
	]).then(axiosBase.spread((res1) => {
		let resData = _.get(res1, 'data.password');
		res.send(resData);
	})).catch(function (error) {
		next(error);
	});
});

app.put("/profile/password", function (req, res, next) {
	let user = {
		"user_id": req.session.passport.user.user_id,
		"password": req.body.password,
	};
	axiosBase.all([
		axios.put(`/user/${req.session.passport.user.user_id}`, _.omitBy(user, _.isNil))
	]).then(axiosBase.spread((res1) => {
		res.end();
	})).catch(function (error) {
		next(error);
	});
});

app.get("/school_activity", function (req, res, next) {

	axios.get(`/schoolActivity`).then(function (response) {
		let resData = _.map(response.data, (data) => {
			return {
				organization_id: data.organization_id,
				organization_name: data.organization_name,
				address: data.prefecture + data.city,
				homepage: data.homepage,
				school_type: _.get(data, 'school.school_type'),
				scholarship_request: _.get(data, 'school.scholarship_request'),
				internship_request: _.get(data, 'school.internship_request'),
				practice_request: _.get(data, 'school.practice_request'),
				fair_application_status: // 説明会申込状況 = 申込中の申込の有無
					_.filter(
						_.get(data, 'school.fair_applications'), (dt) => {
							return dt.application_status === CONST.application_status.APPLYING.value;
						}
					).length > 0,
				fair_application_count: // 説明会申込回数 = 説明会申込した数
					_.filter(
						_.get(data, 'school.fair_applications'), (dt) => {
							return dt.application_status !== CONST.application_status.CANCEL.value;
						}
					).length,
				channel_participation_count: // チャンネル参加数 = 自分が参加した完了イベント数
					_.filter(
						_.get(data, 'event_members'), (dt) => {
							return _.get(dt, "online_event.event_status") === CONST.event_status.DONE.value
								|| _.get(dt, "online_event.event_status") === CONST.event_status.DONE_NO_PAY.value
						}
					).length,
			}
		});
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.get("/hospital_activity", function (req, res, next) {

	axios.get(`/hospitalActivity`).then(function (response) {
		let resData = _.map(response.data, (data) => {
			return {
				organization_id: data.organization_id,
				organization_name: data.organization_name,
				address: data.prefecture + data.city,
				homepage: data.homepage,
				hospital_type: _.get(data, 'hospital.hospital_type'),
				fair_open_status:
					!_.isEmpty(
						_.filter(
							_.get(data, 'fair'),
							(dt) => dt.fair_status === CONST.fair_status.RECRUITING.value
						)
					), // true: 募集中 false: 募集してない
				fair_count:
					_.filter(
						_.get(data, 'fair'),
						(dt) => dt.fair_status !== CONST.fair_status.CANCEL.value
					).length,
				// channel_participation_status:
				// 	_.filter(
				// 		_.get(data, 'event_members'), (dt) => {
				// 			return _.get(dt, "online_event.event_status") === CONST.event_status.OFFICIAL.value
				// 		}
				// 	).length > 0,
				channel_participation_count:
					_.filter(
						_.get(data, 'event_members'), (dt) => {
							return _.get(dt, "online_event.event_status") === CONST.event_status.OFFICIAL.value
								|| _.get(dt, "online_event.event_status") === CONST.event_status.DONE.value
						}
					).length,
			}
		});
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.get("/fair", function (req, res, next) {
	axios.get(`/fair?hospital_id=${req.session.passport.user.organization_id}`).then(function (response) {
		let resData = _.map(response.data, (data) => {
			return {
				fair_id: data.fair_id,
				fair_type: _.map(_.get(data, 'fair_type'), (dt) => { return _.get(dt, 'fair_type') }),
				plan_start_at: data.plan_start_at,
				plan_end_at: data.plan_end_at,
				fair_status: data.fair_status,
				application_count: _.filter(_.get(data, 'fair_applications'), (dt) => {
					return dt.application_status !== CONST.application_status.CANCEL.value
				}).length || 0,
			}
		});
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.put("/fair", function (req, res, next) {
	let fair = {
		fair_id: req.body.fair_id,
		fair_status: req.body.fair_status,
		fair_type: _.map(req.body.fair_type, (dt) => {
			return {
				fair_id: req.body.fair_id,
				fair_type: dt,
			}
		}),
		plan_start_at: req.body.plan_start_at,
		plan_end_at: req.body.plan_end_at,
		append: _.map(req.body.append, (dt) => {
			return _.omit(dt, _.isNil)
		}),
	};
	axiosBase.all([
		axios.put(`/fair/${req.body.fair_id}`, _.omitBy(fair, _.isNil)),
	]).then(axiosBase.spread((res1) => {
		res.send({
			"fair_id": _.get(res1, "data.fair_id")
		});
		res.end();
	})).catch(function (error) {
		next(error);
	});
});

app.patch("/fair", function (req, res, next) {
	let fair = {
		fair_id: req.body.fair_id,
		fair_status: req.body.fair_status,
	};
	axiosBase.all([
		axios.put(`/fair/${req.body.fair_id}`, _.omitBy(fair, _.isNil)),
	]).then(axiosBase.spread((res1) => {
		res.send({
			"fair_id": _.get(res1, "data.fair_id")
		});
		res.end();
	})).catch(function (error) {
		next(error);
	});
});

app.post("/fair", function (req, res, next) {
	let uuid4 = uuidv4();
	let fair = {
		fair_id: uuid4,
		hospital_id: req.session.passport.user.organization_id,
		fair_type: _.map(req.body.fair_type, (dt) => {
			return {
				fair_id: uuid4,
				fair_type: dt,
			}
		}),
		fair_status: CONST.fair_status.RECRUITING.value,
		plan_start_at: req.body.plan_start_at,
		plan_end_at: req.body.plan_end_at,
		append: _.map(req.body.append, (dt) => {
			return _.omit(dt, _.isNil)
		}),
	};
	axiosBase.all([
		axios.post(`/fair`, _.omitBy(fair, _.isNil)),
	]).then(axiosBase.spread((res1) => {
		res.send({
			"fair_id": _.get(res1, "data.fair_id")
		});
		res.end();
	})).catch(function (error) {
		next(error);
	});
});

app.get("/fair/:fair_id", function (req, res, next) {
	axiosBase.all([
		axios.get(`/fair/${req.params.fair_id}`),
		axios.get(`/fair/${req.params.fair_id}/onlineevent`),
		axios.get(`/fair/${req.params.fair_id}/detail`),
		axios.get(`/fair/${req.params.fair_id}/application`),
	]).then(axiosBase.spread((res1, res2, res3, res4) => {
		const event_id = _.get(res2, 'data.0.event_id');
		const plan_start_at = _.get(res1, 'data.plan_start_at') ? dayjs(_.get(res1, 'data.plan_start_at')).format("YYYY-MM-DD") : null;
		const plan_end_at = _.get(res1, 'data.plan_end_at') ? dayjs(_.get(res1, 'data.plan_end_at')).format("YYYY-MM-DD") : null;
		const event_start_at = _.get(res2, 'data.0.start_at') ? dayjs(_.get(res2, 'data.0.start_at')).format("YYYY-MM-DD HH:mm:00") : null;
		const event_end_at = _.get(res2, 'data.0.end_at') ? dayjs(_.get(res2, 'data.0.end_at')).format("YYYY-MM-DD HH:mm:00") : null;
		let resData = {
			"fair_id": _.get(res1, 'data.fair_id'),
			"organization_name": _.get(res1, 'data.organization.organization_name'),
			"fair_type": _.map(_.get(res1, 'data.fair_type'), (dt) => { return _.get(dt, 'fair_type') }),
			"plan_start_at": plan_start_at,
			"plan_end_at": plan_end_at,
			"fair_status": _.get(res1, 'data.fair_status'),
			"event_id": event_id,
			"event_period": event_start_at + "～" + event_end_at,
			"event_start_at": event_start_at,
			"event_end_at": event_end_at,
			"event_type": _.get(res2, 'data.0.event_type'),
			"event_status": _.get(res2, 'data.0.event_status'),
			"append": _.map(_.omitBy(_.get(res3, 'data'), _.isNil), (dt) =>{
				return {
					id: uuidv4(),
					hospital_id: _.get(dt, "append_info.hospital_id"),
					append_information_type: _.get(dt, "append_info.append_information_type"),
					recruiting_period_start: _.get(dt, "append_info.recruiting_period_start"),
					recruiting_period_end: _.get(dt, "append_info.recruiting_period_end"),
					recruiting_job_type: _.get(dt, "append_info.recruiting_job_type"),
					content: _.get(dt, "append_info.content"),
					various_matters: _.get(dt, "append_info.various_matters"),
					other: _.get(dt, "append_info.other"),
					hospital_scholarship: _.get(dt, "append_info.hospital_scholarship"),
					hospital_intership: _.get(dt, "append_info.hospital_intership"),
					hospital_practice: _.get(dt, "append_info.hospital_practice"),
					hospital_fair: {
						append_information_id: _.get(dt, "append_info.hospital_fair.append_information_id"),
						target_person: _.get(dt, "append_info.hospital_fair.target_person"),
						hospital_fair_type: _.map(_.get(dt, "append_info.hospital_fair.hospital_fair_type"), (dt2) => { return _.get(dt2, 'hospital_fair_type') }),
					}
				}
			}),
			"fair_application": _.omitBy(_.get(res4, 'data'), _.isNil),
		};
		 // event_idがからの場合は、以下の処理は行わなくてよい。
		if (!event_id) {
			res.send(resData);
			return;
		}

		axios.get(`/onlineEvent/${event_id}/estimate`).then(function (res5) {
			_.merge(resData, {
				"estimate_status": _.get(res5, 'data.estimate_status'),
				"regular_price": _.get(res5, 'data.regular_price'),
				"discount_price": _.get(res5, 'data.discount_price'),
				"estimate_price": _.get(res5, 'data.estimate_price'),
			});
			res.send(_.omitBy(resData, _.isNil));
		}).catch(function (error) {
			next(error);
		});
	})).catch(function (error) {
		next(error);
	});
});

app.get("/channel", function (req, res, next) {
	axiosBase.all([
		axios.get(`/onlineEvent`),
	]).then(axiosBase.spread((res1) => {
		// ※自分が参加するイベントのみ取得
		let resData = _.filter(_.get(res1, "data"), (dt) => {
			return !_.isEmpty(_.filter(_.get(dt, "event_member"), (dt2) => {
				return _.get(dt2, "organization_id") === req.session.passport.user.organization_id;
			}))
		});

		resData = _.map(resData, (dt) => {
			return {
				event_id: dt.event_id,
				event_type: dt.event_type,
				channel_mode: dt.channel_status,
				owner_name: _.get(_.find(_.get(dt, "event_member"), (dt2) => {
					return dt2.member_role === CONST.member_role.OWNER.value;
				}), "organization.organization_name"),
				member_count: dt.event_member.length,
				organization_name: _.get(dt, "fair.organization.organization_name"),
				organization_type: _.get(dt, "fair.organization.organization_type"),
				fair_type: _.map(_.get(dt, 'fair.fair_type'), (dt2) => { return _.get(dt2, 'fair_type') }),
				event_status: dt.event_status,
				start_at: dt.start_at,
				end_at: dt.end_at,
				school_member: _.map(_.filter(_.get(dt, "event_member"), (dt2) => {
					return dt2.organization.organization_type === CONST.organization_type.SCHOOL.value;
				}), (dt3) => {
					return dt3.organization.organization_name;
				}),
				regular_price: _.get(dt, "estimate.estimate_status") === CONST.estimate_status.OFFICIAL.value ? _.get(dt, "estimate.regular_price") : null,
				estimate_price: _.get(dt, "estimate.estimate_status") === CONST.estimate_status.OFFICIAL.value ? _.get(dt, "estimate.estimate_price") : null,
			}
		})
		res.send(resData);
	})).catch(function (error) {
		next(error);
	});
});

app.get("/channel/:event_id", function (req, res, next) {
	axiosBase.all([
		axios.get(`/onlineEvent/${req.params.event_id}`),
		axios.get(`/eventMember/${req.params.event_id}`),
	]).then(axiosBase.spread((res1, res2) => {
		const fair_id = _.get(res1, 'data.fair_id');
		if (!fair_id) {
			let resData = {
				"event": _.get(res1, 'data'),
				"event_member": _.get(res2, 'data'),
			};
			res.send(_.omitBy(resData, _.isNil));
			return;
		}

		axiosBase.all([
			axios.get(`/fair/${fair_id}`),
			axios.get(`/fairApplication/${fair_id}/application`),
		]).then(axiosBase.spread((res3, res4) => {
			let resData = {
				"event": _.get(res1, 'data'),
				"event_member": _.get(res2, 'data'),
				"fair": _.get(res3, 'data'),
				"application": _.get(res4, 'data'),
			};
			res.send(_.omitBy(resData, _.isNil));
			return;


		})).catch(function (error) {
			next(error);
		});
	})).catch(function (error) {
		next(error);
	});
});

app.post("/individualEvent", function (req, res, next) {
	const event_id = uuidv4();
	// TODO start_atとend_atに適した日付を入力すること
	let event = {
		"event_id": event_id,
		"event_type": CONST.event_type.INDIVIDUAL.value,
		"event_status": CONST.event_status.OFFICIAL.value,
		"start_at": req.body.start_at,
		"end_at": dayjs(req.body.start_at).add(1, 'hour').format('YYYY-MM-DD HH:mm:00'),
	};
	const fair_participant = [{ // 学校
		"event_id": event_id,
		"organization_id": req.body.organization_id,
		"member_role": CONST.member_role.OTHER.value,
	}];
	const fair_organizer = [{
		"event_id": event_id,
		"organization_id": req.session.passport.user.organization_id,
		"member_role": CONST.member_role.OWNER.value,
	}];
	const event_member = _.unionBy(fair_organizer, fair_participant, "organization_id");

	axiosBase.all([
		axios.get(`/organization/${req.session.passport.user.organization_id}`),
		axios.post(`/onlineEvent`, _.omitBy(event, _.isNil)),
	]).then(axiosBase.spread((res0, res1) => {
		axiosBase.all([
			axios.put(`/eventMember/${event_id}`, event_member),
		]).then(axiosBase.spread((res2, res3) => {
			res.end();
		})).catch(function (error) {
			next(error);
		});
	})).catch(function (error) {
		next(error);
	});
});

app.put("/individualEvent/:event_id", function (req, res, next) {
	let event = {
		"event_id": req.params.event_id,
		"start_at": req.body.start_at,
		"end_at": dayjs(req.body.start_at).add(1, 'hour').format('YYYY-MM-DD HH:mm:00'),
	};
	const fair_participant = [{ // 学校
		"event_id": req.params.event_id,
		"organization_id": req.body.organization_id,
		"member_role": CONST.member_role.OTHER.value,
	}];
	const fair_organizer = [{
		"event_id": req.params.event_id,
		"organization_id": req.session.passport.user.organization_id,
		"member_role": CONST.member_role.OWNER.value,
	}];
	const event_member = _.unionBy(fair_organizer, fair_participant, "organization_id");

	axiosBase.all([
		axios.put(`/onlineEvent/${req.params.event_id}`, _.omitBy(event, _.isNil)),
		axios.put(`/eventMember/${req.params.event_id}`, event_member),
	]).then(axiosBase.spread((res0, res1) => {
		res.end();
	})).catch(function (error) {
		next(error);
	});
});

app.get("/organization", function (req, res, next) {
	axios.get(`/organization`).then(function (response) {
		let resData =  _.filter(_.get(response, 'data'), (dt) => {
			return dt.organization_type === CONST.organization_type.SCHOOL.value;
		});
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

/**
 * チャンネル->一覧->オンラインイベント一覧取得
 */
app.get("/channelMember", function (req, res, next) {
	// 自身の病院IDを仮定義(セッション情報に保持予定)
	let my_organization_id = "2e1cee40-ad60-325a-9942-7c260c546660";

	axios.get("/onlineEvent").then(function (response) {

		// 条件(1) event_member配列内のorganization.organization_idが作業中アカウントと一致する
		// オブジェクトのみを絞り込み
		let resData = _.filter(response.data, function (inner_data) {
			let isValid = _.filter(_.get(inner_data, "event_member"), function (dt) {
				return _.includes(_.get(dt, "organization"), my_organization_id);
			});
			if (isValid.length > 0) {
				return true;
			}
			return false;
		});

		// event_member配列に自身のorganization_idを持つレコードのみ処理する
		resData = _.map(resData, (data) => {
			return {
				event_id: _.get(data, 'event_id'),
				event_type: _.get(data, 'event_type'),
				channel_status: _.get(data, 'channel_status'),
				// member_role === 1 が条件
				owner_name: _.get(
					_.find(
						_.get(data, 'event_member'), function (dt) {
							return _.get(dt, 'member_role') === CONST.member_role.OWNER.value
						}
					),
					"organization.organization_name"
				),
				member_count: _.get(data, 'event_member').length,
				organization_name: _.get(data, 'fair.organization.organization_name'),
				organization_type: _.get(data, 'fair.organization.organization_type'),
				fair_type: _.map(_.get(data, 'fair.fair_type'), (dt) => { return _.get(dt, 'fair_type') }),
				event_status: _.get(data, 'event_status'),
				start_at: _.get(data, 'start_at'),
				end_at: _.get(data, 'end_at'),
			}
		});
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

/**
 * チャンネル->登録->見積金額ダイアログ
 * 2020-04-02 実装完了
 */
app.get("/service", function (req, res, next) {
	axios.get("/service").then(function (response) {
		let resData = _.map(response.data, (data) => {
			if (CONST.fair_format.INDIVIDUAL.value == data.fair_format && data.school_number == 1) {
				// ※data.fair_formatが個別のもののみ処理する
				// ※data.school_numberが1のもののみ処理する
				return {
					service_id: _.get(data, 'service_id'),
					service_type: _.get(data, 'service_type'),
					location: _.get(data, 'location'),
					price: _.get(data, 'price'),
				}
			} else{
				// 該当しない場合の返却値のフォーマットは?
				return null;
			}
		});
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});



// チャンネル->詳細->チャンネル詳細取得
app.get("/channel/:event_id/detail", function (req, res, next) {
	let event_id = req.params.event_id;
	axiosBase.all([
		axios.get(`/onlineEvent/${event_id}`),
		axios.get(`/eventMember/${event_id}`),
	]).then(axiosBase.spread((res1, res2) => {
		let fair_id = res1.data.fair_id;
		axiosBase.all([
			axios.get(`/fair/${fair_id}`),
			axios.get(`/fairApplication/${fair_id}/application`),
		]).then(axiosBase.spread((res3, res4) => {
		　  let resData = {
				event_id: _.get(res1, "data.event_id"),
				event_type: _.get(res1, "data.event_type"),
				channel_status: _.get(res1, "data.channel_status"),
				organization_name: _.get(res3, "data.organization.organization_name"),
				fairType: _.get(res3, "data.fair_type"), // ※配列
				event_status: _.get(res1, "data.event_status"),
				start_at: _.get(res1, "data.start_at"),
				end_at: _.get(res1, "data.end_at"),
				member: _.map(res2.data, (data, index) => {
					if (data.organization.organization_type === CONST.organization_type.SCHOOL.value) {
						return {
							organization_id: _.get(data, "organization.organization_id"),
							organization_name: _.get(data, "organization.organization_name"),
							organization_type: _.get(data, "organization.organization_type"),
							member_role: _.get(data, "member_role"),
							format: _.get(res4, "data." + index + ".format"),
							estimate_participant_number: _.get(res4, "data." + index + ".estimate_participant_number")
						}
					} else {
						return {
							organization_id: _.get(data, "organization.organization_id"),
							organization_name: _.get(data, "organization.organization_name"),
							organization_type: _.get(data, "organization.organization_type"),
							member_role: _.get(data, "member_role"),
							format: null,
							estimate_participant_number: null
						}
					}
				})
			}
			res.send(resData);
		})).catch(function (error) {
			next(error);
		});
	})).catch(function (error) {
		next(error);
	});
});


app.get("/notification", function (req, res, next) {

	// 自分の組織ID
	let organization_id = req.session.passport.user.organization_id;
	axios.get(`/notification/${organization_id}`).then(function (response) {
		let resData = {
			unread: _.some(response.data, {confirm_status: CONST.read_status.UNREAD.value}),
			notification: _.orderBy(_.map(response.data, (data) => {
				return {
					notification_id: _.get(data, 'notification_id'),
					title: _.get(data, 'title'),
					// content: _.get(data, 'content'),
					notification_at: _.get(data, "notification_at"),
				}
			}), 'notification_at', 'desc')
		}
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.get("/notification/:notification_id", function (req, res, next) {

	// 自分の組織ID
	let organization_id = req.session.passport.user.organization_id;
	axios.get(`/notification/${organization_id}/${req.params.notification_id}`).then(function (response) {
		let resData = response.data;
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.get("/unread_notification", function (req, res, next) {

	// 自分の組織ID
	let organization_id = req.session.passport.user.organization_id;
	axios.get(`/notification/${organization_id}`).then(function (response) {
		let resData = {
			unread: _.some(response.data, {confirm_status: CONST.read_status.UNREAD.value}),
			notification: _.orderBy(_.filter(response.data, (data) => {
				return data.confirm_status === CONST.read_status.UNREAD.value;
			}), 'notification_at', 'desc')
		}
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.put("/notification", function (req, res, next) {

	// 自分の組織ID
	let organization_id = req.session.passport.user.organization_id;
	axios.put(`/notification/${organization_id}`).then(function (response) {
		res.end();
	}).catch(function (error) {
		next(error);
	});
});


/**
 * 詳細->請求詳細
 * 2020-04-02 実装完了
 */
app.post("/channel", function (req, res, next) {
	// postデータのフォーマットを以下のように仮定する
	// let dummy = {
	// 	"date_at": "2020-01-01",
	// 	"event_member": [
	// 		{
	// 			"organization_id": "11111111",
	// 			"member_role": 3
	// 		},
	// 		{
	// 			"organization_id": "11111111",
	// 			"member_role": 3
	// 		}
	// 	]
	// }
	// つまり以下のようにパースする
	let date_at = req.body.date_at;
	let event_member = req.body.event_member;
	let online_event = {
		event_id: uuidv4(),
		// fair_id: uuidv4(),
		event_type: CONST.event_type.INDIVIDUAL.value,
		event_status: CONST.event_status.OFFICIAL.value,
		channel_status: CONST.channel_mode.OPEN.value,
		start_at: date_at + " " + "00:00:00",
		end_at: date_at + " " + "23:59:59"
	};
	// (1)
	axiosBase.all([
		axios.post("/onlineEvent", _.omitBy(online_event, _.isNil))
	]).then(axiosBase.spread(function (res1) {

		// (2)
		axiosBase.all([
			axios.put(`/eventMember/${online_event.event_id}`, _.omitBy(event_member, _.isNil))
		]).then(axiosBase.spread(function (res2) {

			// (3)
			let estimate = {
				estimate_id: uuidv4(),
				event_id: online_event.event_id,
				estimate_status: CONST.estimate_status.OFFICIAL.value,
				regular_price: 0,
				discount_price: 0,
				estimate_price: 0
			};
			axiosBase.all([
				axios.post("/estimate", _.omitBy(estimate, _.isNil)),
			]).then(axiosBase.spread(function (res3) {
				// レスポンスの返却
				res.end();
			})).catch(function (error) {
				next(error);
			});
		})).catch(function (error) {
			next(error);
		});
	})).catch(function (error){
		next(error);
	});
});

/**
 * チャンネル->請求->一覧->請求一覧取得
 */
app.get("/payment", function (req, res, next) {
	// セッション内に保持している自身のhospital_id
	let hospital_id = req.session.passport.user.organization_id;

	axiosBase.all([
		axios.get("/payment"),
	]).then(axiosBase.spread(function (response) {
		let resData = _.filter(response.data, function (data) {
			// ログイン中アカウントの請求のみ返却
			return data.payment_hospital_id === hospital_id &&
				data.payment_status === CONST.payment_status.DECIDED.value;
		});
		res.send(resData);
	})).catch(function (error) {
		next(error);
	});
});

app.get("/payment/:payment_id", function (req, res, next) {

	axiosBase.all([
		axios.get(`/payment/${req.params.payment_id}`),
	]).then(axiosBase.spread(function (response) {
		let resData = response.data;
		res.send(resData);
	})).catch(function (error) {
		next(error);
	});
});

var AccessToken = require('twilio').jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;

// Endpoint to generate access token
app.get('/token', function (request, response, next) {
	var identity = request.query.identity;
	var room = request.query.room;

	// Create an access token which we will sign and return to the client,
	// containing the grant we just created
	var token = new AccessToken(
		process.env.TWILIO_ACCOUNT_SID || 'AC43eff80459b9b0429c0d2b0395a10d6c',
		process.env.TWILIO_API_KEY || 'SK9b2874d9a154f16da424dc90bb7ce134',
		process.env.TWILIO_API_SECRET || 'Paj7iWmsMpEoOjz9UgHdcowx3P5HdNxb'
	);

	// Assign the generated identity to the token
	token.identity = identity;

	const grant = new VideoGrant({
		room: room
	});
	// Grant token access to the Video API features
	token.addGrant(grant);

	// Serialize the token to a JWT string and include it in a JSON response
	response.send({
		identity: identity,
		token: token.toJwt()
	});
});


function logErrors (err, req, res, next) {
	logger.error(err);
	next(err);
}

function errorHandler (err, req, res, next) {
	res.status(err.status).send({
		error: err.data
	});
}

app.use(logErrors);
app.use(errorHandler);

module.exports = {
	path: "/api/",
	handler: app
};
