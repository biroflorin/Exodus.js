var moment  = require('moment');
var Promise = require('bluebird');
var _       = require('lodash');
var runWebSocket = require('./runWebSocket');

module.exports = function(_global) {

	var executeFunctions = function(type, callback) {
        if(callback && typeof callback == 'function') {
            _global.customCallback = callback;
        }
		else if(callback && callback.constructor === Array) {
            _global.callback_websockets = callback;
        }
        if(typeof _global.functions === 'function') {
            _global.functions = [_global.functions];
        }
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
    	_.each(_global.functions, function(fn, id) {
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
        if(_global.callback_websockets && _global.callback_websockets.length) {
            // run the websocketed controllers before responding to the client
            runWebSocket.executeControllers(_global);
            //Not sure if we should wait for websocketed controllers to finish before ending this user request?
            defaultCallback(response);
        }
        else if(_global.customCallback && typeof _global.customCallback === 'function') {
            //if we have a custom response handler run that
            _global.customCallback(response)
        }
        else {
            //by default run the response header and send back the payload to client
            defaultCallback(response);
        }
    };

    var defaultCallback = function(data) {
        if(_global.req.is_websocket) {
            runWebSocket.emitCollectionUpdate(data, _global);
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