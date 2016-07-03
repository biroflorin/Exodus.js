var Promise = require('bluebird');
var app_root = process.cwd();
var runFunction = require('./runFunction');
var renderClient = require('./renderClient');

var _exodus = {
    routes_config: {},
    collection_config: {},
    registerExpressApp: function(app, io) {
        _exodus.app = app;
        _exodus.io = io;
        return _exodus;
    },
    LOAD: function(req, res) {
        var _global = {
            commons: {
                req: req,
                res: res,
                _exodus: _exodus
            }
        };

        return {
            runFunction: runFunction(_global.commons),
            renderClient: renderClient(_exodus, res)
        }
    }
};

//  Exodus.js 0.1 (alpha)
//  ===============================
var setupExodusRoutes = require('./setupExodusRoutes')(_exodus);
var _ = require('lodash');

module.exports = function() {
    return _exodus;
}
