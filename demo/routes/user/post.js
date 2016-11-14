var Exodus = require('../../../Exodus')(),
    UserModel = require('../../model/user.js');

module.exports = function(req, res) {
	var Exod = Exodus.LOAD(req, res);

    var storeUser = function() {
        return UserModel.create(req.vars);
    }

    Exod.runFunction(storeUser).run(['user']); //declaring the 'user' string in an array as parameter in the run/sync/async function will trigger the websocketed user GET controller
}
