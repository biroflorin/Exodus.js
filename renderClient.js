ejs = require('ejs');

module.exports = function(_exodus, res) {
	return function(template, ejs_vars) {

		if(typeof ejs_vars == 'object') {
			ejs_vars.exodus_scripts = null; //_global.scripts_html;
			ejs_vars.routes_config = _exodus.routes_config
		}
		else {
			ejs_vars = {
				scripts_html: null
			}
		}

    	res.render(template, ejs_vars);
	}
};