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
        "Model" : {},
        "View" : {},
        "Controller" : {}
    }
};

/**
 * string that separates composed cache keys
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

    var store = this.store[type];

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
 * @param {string} type
 * @param {*} obj
 *
 * TODO: interval that invalidates cache entries by specified argument e.g. end_time exceeded
 */
VDRest.Lib.Cache.prototype.invalidate = function (obj) {

    var key = this.getCacheKey(obj.data, obj.cacheKey), cache;

    if ("undefined" === typeof obj._class) {

        throw new ReferenceError('Cannot determine cache type from object. Property _class not defined in argument obj.');
    }

    cache = this.getClassCache(obj._class);

    if (cache && "undefined" !== typeof cache[key].canInvalidate && cache[key].canInvalidate) {

        delete cache[key];
    }
};

/**
 * retrieve cache
 * @param _class
 * @returns {object}
 */
VDRest.Lib.Cache.prototype.getClassCache = function (_class) {

    var cache = this.getCacheByType(_class),
        classCache;

    if (cache) {
        new RegExp('.*(Model|View|Controller)\\.(.*)').test(_class);

        classCache = RegExp.$2;

        if ("undefined" !== typeof cache[classCache]) {

            cache = cache[classCache];
        }
    }

    return cache;
};

/**
 * retrieve cache type
 * @param {string} _class
 * @returns {string}
 */
VDRest.Lib.Cache.prototype.getCacheByType = function (_class) {

    var cache = null;

    if (_class.indexOf('.Model.') > -1) {
        cache = this.store.Model;
    }

    if (_class.indexOf('.View.') > -1) {
        cache = this.store.View;
    }

    if (_class.indexOf('.Controller.') > -1) {
        cache = this.store.Controller;
    }

    return cache;

};