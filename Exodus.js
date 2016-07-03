//  Exodus.js 0.1 (alpha)
//  ===============================
var Promise 		= require('bluebird');
var app_root 		= process.cwd();
var runFunction		= require('./runFunction');
var _exodus = {};

module.exports = function() {
	var START = function(app) {
		
	};

	var LOAD = function(req, res) {
		var _global = {
			commons: {
				req: req,
				res: res
			}
		};

		return {
			runFunction: runFunction(_global.commons),
			renderClient: renderClient({
				res: res,
				scripts_html: _exodus.scripts_html
			}),
		}
	};

	return {
		START: START,
		LOAD: LOAD,
	}
}