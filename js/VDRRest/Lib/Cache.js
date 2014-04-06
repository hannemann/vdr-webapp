/**
 * @class
 * @constructor
 * @var {object} store
 * @property {object} controllers
 * @property {object} models
 * @property {object} views
 */
VDRest.Lib.Cache = function () {

    this.store = {
        "controllers" : {},
        "models" : {},
        "views" : {}
    }
};

/**
 *
 * @type {string}
 */
VDRest.Lib.Cache.prototype.cacheKeySeparator = '/';

/**
 * retrieve cache object
 * @param {string} type
 * @param {string} [_class]
 * @returns {object}
 */
VDRest.Lib.Cache.prototype.getStore = function (type, _class) {

    var store = this.store[type.toLowerCase() + 's'];

    if ("undefined" !== typeof _class) {

        if ("undefined" === typeof store[_class]) {
            store[_class] = {};
        }
        return store[_class];
    }

    return store;
};

/**
 * build cacheKey from appropriate properties of data object
 * @param data
 * @param keyNames
 * @returns {*}
 */
VDRest.Lib.Cache.prototype.getCacheKey = function (data, keyNames) {

    var keys = keyNames.split(this.cacheKeySeparator),
        cacheKey = data[keys[0]],
        i= 1, l=keys.length;

    if (l > 1) {

        for (i;i<l;i++) {
            cacheKey += '/' + data[keys[i]];
        }
    }

    return cacheKey;
};

/**
 * invalidate cache entry
 * @param obj
 */
VDRest.Lib.Cache.prototype.invalidate = function (obj) {

    var key = this.getCacheKey(obj.data, obj.cacheKey);


};