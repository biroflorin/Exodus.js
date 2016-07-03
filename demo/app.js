var express = require('express');
var app = express();
var Exodus = require('../Exodus')();
var Promise = require('bluebird');
var _ = require('lodash');


var routes_config = {};
var collection_config = {};


var setupExodusRoutes = {

    registerNewConfig: function(args) {
        if (!args.express_route || !args.method || !args.file || !args.collectionName) {
            console.warn('Incorrect register parameters passed, please pass express_route, method, file and collection');
        } else if (!collection_config[args.collectionName]) {
            console.warn('No collection found!');
        } else {
            routes_config[args.express_route] = {};
            routes_config[args.express_route][args.method] = _.pick(args, ['file', 'collection']);
        }
        return setupExodusRoutes;
    },

    registerNewCollection: function(args) {
        if (!args.collectionName || !args.propertyID) console.warn('Incorrect register parameters passed, please pass name and propertyID ');
        else {
            collection_config[args.collectionName] = args.propertyID;
        }
        return setupExodusRoutes;
    },

    start: function() {
        return setupExodusRoutes.loopRoutesConfigsAndCreateEndpoints();
    },

    loopRoutesConfigsAndCreateEndpoints: function() {
        _.each(routes_config, setupExodusRoutes.loadRoute);

        return setupExodusRoutes;
    },

    loadRoute: function(method_config, api_path) {
        _.each(method_config, function(method_detail, method_name) {
            setupExodusRoutes.loadMethodConfig(method_detail, method_name, api_path);
        });
    },

    loadMethodConfig: function(method_detail, method_name, api_path) {
        var callback = require(method_detail.file);
        app[method_name](api_path, callback);

        console.log('created route', api_path, 'that calls file', method_detail.file)
    }
};


setupExodusRoutes

//	Setup a new collection API
    .registerNewCollection({
    collectionName: 'test',
    propertyID: 'testID'
})


// Setup a new config API
.registerNewConfig({
    express_route: '/test_endpoint',
    method: 'get',
    file: './test_endpoint.js',
    collectionName: 'test'
})

// Compile the endpoints
.start();




app.get('/', function(req, res) {
    var Exod = Exodus.LOAD(req, res);
    var functions = [
        function() {
            var data = 'first function';
            return data;
        },
        function() {
            var data = 'second function';
            return new Promise(function(resolve) {
                setTimeout(function() {
                    return resolve(data);
                }, 3000);
            })
        },
        function() {
            var data = 'third function';
            return data;
        }
    ];
    Exod.runFunction(functions).async();
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
