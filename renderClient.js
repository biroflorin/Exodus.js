module.exports = function(_global) {
	return function(template, ejs_vars) {
		if(typeof ejs_vars == 'object') {
			ejs_vars.exodus_scripts = _global.scripts_html;
		}
		else {
			ejs_vars = {
				scripts_html: _global.exodus_scripts
			}
		}
    	_global.res.render(template, ejs_vars);
	}
};