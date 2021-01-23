const logger = require("../server/logger").logger;
var axiosBase = require("axios");

const axios = axiosBase.create({
	baseURL: (process.env.BACK_URL || 'https://dlinkback.azurewebsites.net') + '/api/v1', // mock server
	headers: {
		'Content-Type': 'application/json',
		'X-Requested-With': 'XMLHttpRequest'
	},
	responseType: 'json',
	timeout: 5000
});
axios.interceptors.request.use(request => {
	logger.debug("[Axios] REQUEST METHOD:", request.method, "URL:", request.url);
	request.method != "get" ? logger.debug("[Axios] REQUEST DATA:", request.data) : "";
	return request
});

axios.interceptors.response.use(function (response) {
	// Do something with response data
	logger.debug("[Axios] RESPONSE METHOD:", response.config.method, "URL:", response.config.url);
	logger.debug("[Axios] RESPONSE DATA:", response.data);
	// logger.debug("[Axios] RESPONSE DATA:", response.data);
	return response;
}, function (error) {

	if (error.response) {
		// The request was made and the server responded with a status code
		// that falls out of the range of 2xx
		logger.error("[Axios] ERROR RESPONSE METHOD:", error.config.method, "URL:", error.config.url, "STATUS:", error.response.status, "TEXT:", error.response.statusText, "DATA:", error.response.data);
		// logger.debug(error.response.headers);
		return Promise.reject(error.response);
	} else if (error.request) {
		// The request was made but no response was received
		// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
		// http.ClientRequest in node.js
		logger.error("[Axios] ERROR REQUEST:", error.request);
	} else {
		// Something happened in setting up the request that triggered an Error
		logger.error('[Axios] ERROR:', error.message);
	}
});

module.exports = {
	axiosBase,
	axios
};
