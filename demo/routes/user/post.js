var Exodus = require('../../../Exodus')();

module.exports = function(req, res) {
	var Exod = Exodus.LOAD(req, res);

    var storeUser = function() {
        var userID = 5; //store user and return the new userID
        req.urlVars.userID = userID; //store userID as url variable to be used in the websocketed user GET controller
    }

    Exod.runFunction(storeUser).run(['user']); //declaring the 'user' string in an array as parameter in the run/sync/async function will trigger the websocketed user GET controller
}