var express = require('express');
var app = express();
var Exodus = require('../Exodus')();
var Promise = require('bluebird');
var _ = require('lodash');
var http = require('http').Server(app);
var io = require('socket.io')(http);
io.on('connection', function(socket){
  console.log('a user connected');
});

Exodus

.registerExpressApp(app, io)

// Setup a new config API
.registerNewConfig({
    express_route: '/',
    method: 'get',
    file: process.cwd() +'/routes/get.js'
})

//  Setup a collection API for USERS
.registerNewCollection({
    collectionName: 'user',
    propertyID: 'userID'
})
// Setup a GET config API for USERS
.registerNewConfig({
    express_route: '/user/:userID',
    method: 'get',
    file: process.cwd() +'/routes/user/get.js',
    collectionName: 'user'
})
// Setup a POST config API for USERS
.registerNewConfig({
    express_route: '/user',
    method: 'post',
    file: process.cwd() +'/routes/user/post.js',
    collectionName: 'task'
})

// Compile the endpoints
.start();

http.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
