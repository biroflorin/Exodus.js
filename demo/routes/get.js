var Exodus = require('../../Exodus')();
var Promise = require('bluebird');

module.exports = function(req, res) {
    var Exod = Exodus.LOAD(req, res);
    var functions = [
        function user() {
            var users_db = {
                2: {
                    userID: 2,
                    name: 'James Brown',
                    email: 'james.brown@example.com'
                },
                3: {
                    userID: 3,
                    name: 'Alicie Blue',
                    email: 'alicie.blue@example.com'
                },
                4: {
                    userID: 4,
                    name: 'Andrew White',
                    email: 'andrew.white@example.com'
                },
                5: {
                    userID: 5,
                    name: 'Edward Black',
                    email: 'edward.black@example.com'
                }
            };
            return users_db;
        }
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