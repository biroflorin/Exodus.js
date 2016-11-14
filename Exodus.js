var Promise         = require('bluebird');
var _               = require('lodash');
var app_root        = process.cwd();
var runFunction     = require('./runFunction');
var renderClient    = require('./renderClient');

var _exodus = {
    routes_config: {},
    collection_config: {},

    registerExpressApp: function(app, io) {
        _exodus.app = app;
        _exodus.io = io;
        return _exodus;
    },
    registerNewConfig: function(args) {
        _exodus.routes_config[args.express_route] = _exodus.routes_config[args.express_route] || {}; 
        _exodus.routes_config[args.express_route][args.method] = _.pick(args, ['file', 'collection']);
        return _exodus;
    },
    registerNewCollection: function(args) {
        if (!args.collectionName || !args.propertyID) 
            console.warn('Incorrect register parameters passed, please pass name and propertyID ');
        else
            _exodus.collection_config[args.collectionName] = args.propertyID;
        return _exodus;
    },

    loadRoute: function(method_config, api_path) {
        _.each(method_config, function(method_detail, method_name) {
            _exodus.loadMethodConfig(method_detail, method_name, api_path);
        });
    },

    loadMethodConfig: function(method_detail, method_name, api_path) {
        var transformVariables = function(req, res, next) {
            req.urlVars = req.params;
            switch(method_name) {
                case 'get':
                case 'delete':
                    req.vars = req.query; //T: should be urlVars?
                    break;
                case 'put':
                case 'post':
                    req.vars = req.body; //T: same as above
                    break;
            }
            next();
        };
        var callback = require(method_detail.file);
        _exodus.app[method_name](api_path, transformVariables, callback);

        console.log('created route', api_path, 'that calls file', method_detail.file)
    },

    start: function() {
        _.each(_exodus.routes_config, _exodus.loadRoute);
        return _exodus;
    },

    LOAD: function(req, res) {
        var _global = {
            req: req,
            res: res,
            _exodus: _exodus
        };

        return {
            runFunction: runFunction(_global),
            renderClient: renderClient(_exodus, res)
        }
    }
};

//  Exodus.js 0.1 (alpha)
//  ===============================
var _ = require('lodash');

module.exports = function() {
    return _exodus;
}
