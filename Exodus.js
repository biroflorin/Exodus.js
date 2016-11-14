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

    registerNewRoute: function(args) {
        var route = args.express_route,
            method = args.method,
            controllerBody = require(args.file);
            
        _exodus.routes_config[route] = _exodus.routes_config[route] || {}; 
        _exodus.routes_config[route][method] = _.pick(args, ['file', 'collection']);
        
        _exodus.app[method](route, transformVariables, controllerBody);

        console.log('created route', route, 'that calls file', args.file)
        
        function transformVariables(req, res, next) {
            req.urlVars = req.params;
            switch(method) {
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
        return _exodus;
    },

    registerNewCollection: function(args) {
        if (!args.collectionName || !args.propertyID) 
            console.warn('Incorrect register parameters passed, please pass name and propertyID ');
        else
            _exodus.collection_config[args.collectionName] = args.propertyID;
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
