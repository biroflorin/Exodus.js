//  Exodus.js 0.1 (alpha)
//  ===============================
var Promise 		= require('bluebird');
var app_root 		= process.cwd();
var runFunction		= require('./runFunction');
var _exodus = {};

module.exports = function() {
	var START = function(app, io, routes) {
		
	};

	var LOAD = function(req, res, config) {
		var _global = {};
		
	};

	return {
		START: START,
		LOAD: LOAD,
	}
}