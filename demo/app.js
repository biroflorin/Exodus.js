var express = require('express');
var app = express();
var Exodus = require('../Exodus')();
var Promise = require('bluebird');
var _ = require('lodash');

Exodus

.registerExpressApp(app)

// Setup a new config API
.registerNewConfig({
    express_route: '/',
    method: 'get',
    file: process.cwd() +'/routes/get.js'
})
//	Setup a new collection API
.registerNewCollection({
    collectionName: 'test',
    propertyID: 'testID'
})
// Setup a new config API
.registerNewConfig({
    express_route: '/test_endpoint',
    method: 'get',
    file: process.cwd() +'/routes/test_endpoint.js',
    collectionName: 'test'
})

// Compile the endpoints
.start();

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
