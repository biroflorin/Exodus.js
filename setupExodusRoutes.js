var _ = require('lodash');
var _global = {};

var setupExodusRoutes = {
    registerNewConfig: function(args) {
        if (!args.express_route || !args.method || !args.file || !args.collectionName) {
            console.warn('Incorrect register parameters passed, please pass express_route, method, file and collection');
        } else if (!_global._exodus.collection_config[args.collectionName]) {
            console.warn('No collection found!');
        } else {
            _global._exodus.routes_config[args.express_route] = {};
            _global._exodus.routes_config[args.express_route][args.method] = _.pick(args, ['file', 'collection']);
        }
        return setupExodusRoutes;
    },

    registerNewCollection: function(args) {
        if (!args.collectionName || !args.propertyID) console.warn('Incorrect register parameters passed, please pass name and propertyID ');
        else {
            _global._exodus.collection_config[args.collectionName] = args.propertyID;
        }
        return setupExodusRoutes;
    },

    start: function() {
        return setupExodusRoutes.loopRoutesConfigsAndCreateEndpoints();
    },

    loopRoutesConfigsAndCreateEndpoints: function() {
        _.each(_global._exodus.routes_config, setupExodusRoutes.loadRoute);

        return setupExodusRoutes;
    },

    loadRoute: function(method_config, api_path) {
        _.each(method_config, function(method_detail, method_name) {
            setupExodusRoutes.loadMethodConfig(method_detail, method_name, api_path);
        });
    },

    loadMethodConfig: function(method_detail, method_name, api_path) {
        var callback = require(method_detail.file);
        _global.app[method_name](api_path, callback);

        console.log('created route', api_path, 'that calls file', method_detail.file)
    }
};

module.exports = function(app, _exodus) {
	_global.app = app;
	_global._exodus = _exodus;
	return setupExodusRoutes;
}