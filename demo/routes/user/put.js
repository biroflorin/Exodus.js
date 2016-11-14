var Exodus = require('../../../Exodus')(),
    _ = require('lodash'),
    UserModel = require('../../model/user.js');

module.exports = function(req, res) {
	var Exod = Exodus.LOAD(req, res);

    var changeUser = function() {
        var user = UserModel.getById(req.urlVars.userID);
        if (!user){
            res.status = 404;
            return "Not Found";
        }
        _.each(req.vars, function(v, k){
                if (k===UserModel.id_key)
                    return;
                user[k] = v;
            });
        debugger;
        return user.save();
    };

    Exod.runFunction(changeUser).run(['user']); //declaring the 'user' string in an array as parameter in the run/sync/async function will trigger the websocketed user GET controller
}
