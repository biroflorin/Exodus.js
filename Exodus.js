//  Exodus.js 0.1 (alpha)
//  ===============================
var Promise 		= require('bluebird');
var app_root 		= process.cwd();
var runFunction		= require('./runFunction');
var renderClient		= require('./renderClient');
var setupExodusRoutes = require('./setupExodusRoutes');
var _exodus = {
	routes_config: {},
	collection_config: {}
};

module.exports = function() {
	var INIT = function(app) {
		return setupExodusRoutes(app, _exodus);
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
		INIT: INIT,
		LOAD: LOAD,
	}
}