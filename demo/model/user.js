var _ = require('lodash'),
    fs = require('fs');

var data_filename = __dirname+'/users.json',
    data    = require(data_filename),
    id_key  = 'userID';

function makeID() {
    return 1 + data.reduce(function(tot, cur, i, all) {
            if ( cur[id_key] > tot )
                return cur[id_key];
            return tot;
        }, -1);
}

function saveAll() {
    return fs.writeFileSync(data_filename, JSON.stringify(data));
}

// ---

function User(data) {
    var that = this;
    _.each(data, function(v, k){
        that[k] = v;
    });
}

User.prototype.save = function() {
    var saveObj = {};
    _.each(this, function(v, k) {
        saveObj[k] = v;
    });
    data = data.map(function(datum){
        if (datum[id_key] == saveObj[id_key])
            return saveObj;
        else
            return datum;
    });
    saveAll();
    return this;
}
User.prototype.delete = function() {
    data = data.filter(function(datum){
            if (datum[id_key] !== saveObj[id_key])
                return datum;
        });
    saveAll();
}

User.prototype.toString = function() {
    return JSON.stringify(this);
}

// ---

module.exports = {
    getAll: function() {
        return data;
    },
    getById: function(id) {
        var res = data.filter(function(v){ return v[id_key] == id; });
        return res.length ? new User(res[0]) : null;
    },
    getBy: function(map) {
        var res = data.filter(function(datum){ 
            return _.every(map, function(v, k){
                    return datum[k] == v;
                });
        });
        return res.length ? new User(res[0]) : null;
    },
    create: function(map) {
        var id;
        if (Object.keys(map).indexOf(id_key) == -1) {
            //if id_key doesn't exist, find max and +1 it
            map[id_key] = id = makeID();
        } else {
            id = map[id_key];
        }
        var existing = data.reduce(function(t, c, i){
                if (c[id_key] == id)
                    return i;
                else
                    return t;
            }, -1);
        if (existing>-1) {
            data[existing] = map;
        } else {
            data.push(map);
        }
        saveAll();
        return new User(map);
    },
    delete: function(id) {
        data = data.filter(function(v){
            return v[id_key] !== id;
        });
        saveAll();
        return true;
    },
    id_key: id_key
};
