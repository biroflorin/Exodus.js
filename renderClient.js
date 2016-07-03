ejs = require('ejs');

module.exports = function(_exodus, res) {
	return function(template, ejs_vars) {
		if(typeof ejs_vars == 'object') {
			ejs_vars.routes_config = _exodus.routes_config;
			ejs_vars.collection_config = _exodus.collection_config;
		}
		else {
			ejs_vars = {
				routes_config: _exodus.routes_config,
				collection_config: _exodus.collection_config
			}
		}

    	res.render(template, ejs_vars);
	}
};