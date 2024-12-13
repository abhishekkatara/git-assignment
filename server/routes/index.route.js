'use strict';

const apiRoute = require('./apis');
// const errorRoute = require('./error');

function init(server) {
	server.get('*', function (request, response, next) {
		console.log('Request was made to: ' + request.originalUrl);
		return next();
	});
	server.use('/api', apiRoute);
}

module.exports = {
	init: init
};