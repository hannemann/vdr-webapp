/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Database.Resource = function () {};

/**
 * @type {VDRest.Abstract.IndexedDB}
 */
VDRest.Database.Model.Database.Resource.prototype = new VDRest.Abstract.IndexedDB.Database();

/**
 * @type {String}
 */
VDRest.Database.Model.Database.Resource.prototype.dbName = "recordings";

/**
 * default db version -> override!
 * @type {number}
 */
VDRest.Database.Model.Database.Resource.prototype.dbVersion = 2;

/**
 * db structure
 * @type {Object}
 */
VDRest.Database.Model.Database.Resource.prototype.obStoresStruct = {
    "recordings": {
        "keys": {
            "keyPath": "number"
        },
        "indexes": {
            "number": ["number", "number", {"unique": true}]
        }
    },
    "movies" : {
        "keys" : {
            "keyPath" : "movie_id"
        },
        "indexes" : {
            "title" : ["title", "title", {"unique" : false}],
            "release_date" : ["release_date", "release_date", {"unique" : false}],
            "recording_date": ["recording_date", "recording_date", {"unique": false}],
            "vote_average" : ["vote_average", "vote_average", {"unique" : false}]
        }
    },
    "shows" : {
        "keys" : {
            "keyPath" : "series_id"
        },
        "indexes" : {
            "name" : ["name", "name", {"unique" : false}],
            "network" : ["network", "network", {"unique" : false}],
            "rating" : ["rating", "rating", {"unique" : false}]
        }
    },
    "episodes" : {
        "keys" : {
            "keyPath" : "episode_id"
        },
        "indexes" : {
            "name" : ["episode_name", "episode_name", {"unique" : false}],
            "series_id" : ["series_id", "series_id", {"unique" : false}],
            "recording_date": ["recording_date", "recording_date", {"unique": false}],
            "network" : ["network", "network", {"unique" : false}],
            "rating" : ["episode_rating", "episode_rating", {"unique" : false}]
        }
    },
    "images" : {
        "keys" : {
            "keyPath" : "name"
        }
    }
};

/**
 * db structure
 * @type {Object}
 */
VDRest.Database.Model.Database.Resource.prototype.getStores = function () {

    var i, stores = [];

    for (i in this.obStoresStruct) {
        if (this.obStoresStruct.hasOwnProperty(i)) {
            stores.push(i);
        }
    }

    return stores;
};
