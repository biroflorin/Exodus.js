var moment  = require('moment');
var Promise = require('bluebird');
var _       = require('lodash');

module.exports = function(_global) {

	var executeFunctions = function(type, callback) {
		_global.callback = callback;
		return Promise[type](_global.functions, function(value, index, length) {
			return value();
		})
		.catch(handleError)
		.then(formatData)
		.then(clearFunctions)
		.then(establishCallback);
	};

	var handleError = function(err) {
		console.log('ERROR ==', err)
    };

    var formatData = function(data) {
    	var response = {};
    	console.log('_global.functions', _global.functions);
    	console.log('data', data);
    	_.each(_global.functions, function(fn, id) {
    		console.log()
    		var key = fn.name || id;
    		response[key] = data[id];
    	});
    	return response;
    };

    var clearFunctions = function(response) {
    	delete _global.functions;
    	return response;
    };

	var establishCallback = function(response){
        if(_global.is_ws) {
            // return runWS(data);
        }
        else if(_global.callback && typeof _global.callback === 'function') {
            //if we have a custom response handler run that
            _global.callback(response)
        }
        else {
            //by default run the response header and send back the payload to client
            defaultCallback(response);
        }
    };

    var defaultCallback = function(data) {
        if(_global._ws.length > 0) {
            // do ws stuff here
        }
        else {
            clientResponse(data);
        }
    };

    var clientResponse = function(data) {
        if(_global.dbTransaction) {
            _global.dbTransaction.commit();
        }
        _global.res.send({
            success: true,
            data: data
        });
    };

    //not in use ATM as this assumes all functions have a promised based content
    var transformPromiseResponse = function(value, index, length) {
		var name = value.name;
		return value().then(function (data) {
			return {key: name, value: data};
		});
	};

	return function(functions, is_ws) {
		_global._ws = [];
		_global.is_ws = is_ws;
		_global.functions = functions;

        return {
        	run: _.partial(executeFunctions, 'map'),
        	sync: _.partial(executeFunctions, 'mapSeries'),
        	async: _.partial(executeFunctions, 'map')
        }
	}
}