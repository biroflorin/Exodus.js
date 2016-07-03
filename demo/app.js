var express = require('express');
var app = express();
var Exodus = require('../Exodus')();
var Promise = require('bluebird');

app.get('/', function (req, res) {
	var Exod = Exodus.LOAD(req, res);
	var functions = [
		function() {
			var data = 'first function';
			return data;
		},
		function() {
			var data = 'second function';
			return new Promise(function(resolve){
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

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});