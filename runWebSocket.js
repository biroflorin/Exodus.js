var Promise = require('bluebird');
var _       = require('lodash');

module.exports = {
	executeControllers: function(_global) {
		return Promise.mapSeries(_global.callback_websockets, function(collection) {
			//find the controller file that needs executed by search the GET api declaration of that collection
			var collection_key = _global._exodus.collection_config[collection];
			var api_path = '/'+collection+'/:'+collection_key;
			var api_file = _global._exodus.routes_config[api_path].get.file;
			var controllerFunction = require(api_file);

			//flag the request as a websocketed one and run the controller function. the flag is set as the collection id to be bassed when the websocket is emited
			_global.req.is_websocket = collection;
	        return controllerFunction(_global.req, _global.res);
		});
	},
	emitCollectionUpdate: function(data, _global) {
		console.log('testing EMIT WS ===', {
            collection: _global.req.is_websocket,
            data: data
        });
		return new Promise(function(resolve, reject) {
            _global._exodus.io.sockets.emit('client-data-push', {
                collection: _global.req.is_websocket,
                data: data
            });
            return resolve();
        });
	}
}