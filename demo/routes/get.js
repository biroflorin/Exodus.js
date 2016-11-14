var Exodus = require('../../Exodus')(),
    UserModel = require('../model/user.js');
var Promise = require('bluebird');

module.exports = function(req, res) {
    var Exod = Exodus.LOAD(req, res);
    var functions = [
        UserModel.getAll
    ];
    var renderPayload = function(results) {
        var ejsVars = {
            data: results
        };
        Exod.renderClient(process.cwd() +'/views/app.ejs', ejsVars);
    };
    Exod.runFunction(functions).async(renderPayload);

    console.log('loaded get.js');
};
