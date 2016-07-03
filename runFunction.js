var moment  = require('moment');
var Promise = require('bluebird');
var _       = require('underscore');

module.exports = function(_global) {

	//try/catch function wrapper
    var tcWrapper = function(theFunction, theName) {
        return function() {
            try {
                theFunction.apply(this, arguments);
            } catch(e) {
                _global.errorHandler(e, theName).then(function(exitToClient) {
                    exitToClient();
                });
            }
        }
    };

    //wrapp received functions
    var wrappFunctions = function(functions) {
        _.each(functions, function(i,n) {
            var p = functions[n];
            if( typeof p === 'function' ) {
                functions[n] = tcWrapper(p, n);
            }
        });
    };

	return function(functions, is_ws) {
		_global._ws = [];
        if(functions._ws) _global._ws = functions._ws;
        functions = _.omit(functions, '_ws');

        return {
        	run: function(callback) {
        		var func = tcWrapper(functions);
        		//run promise series and callback
        	},
        	sync: function(callback) {
        		wrappFunctions(functions);
        		//run promise sync and callback
        	},
        	async: function(callback) {
        		wrappFunctions(functions);
        		//run promise async and callback
        	},
        	nested: function(callback) {
        		wrappFunctions(functions);
        		var arrayFunctions = [];
                _.each(functions, function(i,n) {
                    var p = functions[n];
                    if( typeof p === 'function' ) {
                        arrayFunctions.push(p);
                    }
                });
                //run promise waterfall and callback
        	}
        }
	}
}