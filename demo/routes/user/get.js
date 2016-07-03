var Exodus = require('../../../Exodus')();

module.exports = function(req, res) {
	var Exod = Exodus.LOAD(req, res);

	//users db
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
			name: 'Edward Black UPDATED',
			email: 'edward.black@example.com'
		}
	};

    var getUser = function() {
        return users_db[req.urlVars.userID];
    }

    Exod.runFunction(getUser).run();
}