var Exodus = require('../../../Exodus')(),
    UserModel = require('../../model/user.js');

module.exports = function(req, res) {
	var Exod = Exodus.LOAD(req, res);

    var getUser = function() {
        return UserModel.getById(req.urlVars.userID);
    }

    Exod.runFunction(getUser).run();
}
