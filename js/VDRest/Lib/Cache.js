/**
 * @typedef {{}} cacheStoreItem
 * @property {Object} Window
 */
/**
 * @typedef {{}} cacheStore
 * @property {Object} Model
 * @property {cacheStoreItem} View
 * @property {cacheStoreItem} ViewModel
 * @property {cacheStoreItem} Controller
 * @property {cacheStoreItem} Helper
 */
/**
 * @class
 * @constructor
 * @property {cacheStore} store
 */
VDRest.Lib.Cache = function () {

    this.store = {
        "Model" : {},
        "View" : {
            "Window" : {}
        },
        "ViewModel" : {
            "Window" : {}
        },
        "Controller" : {
            "Window" : {}
        },
        "Helper" : {
            "Window" : {}
        }

    };
};

/**
 * reinit cache, flushes any data
 */
VDRest.Lib.Cache.prototype.flush = function () {

    VDRest.Lib.Cache.call(this);
};

/**
 * delete entries by key
 * @param {object} cache
 * @param {string} key
 */
//VDRest.Lib.Cache.prototype.flushByKey = function (cache, key) {
//
//    if (cache.hasOwnProperty(key)) {
//        delete cache[key];
//    }
//};

/**
 * delete entries by key
 * @param {object} obj
 */
VDRest.Lib.Cache.prototype.flushByClassKey = function (obj) {

    var i, _class = obj._class, key = obj.keyInCache;

    for (i in this.store) {

        if (this.store.hasOwnProperty(i)) {

            if ("undefined" !== typeof obj.__proto__.cacheKey || obj.data && obj.data.cacheKey) {

                if (this.store[i].hasOwnProperty(_class) && this.store[i][_class].hasOwnProperty(key)) {

                    delete this.store[i][_class][key];
                }

            } else if (this.store[i].hasOwnProperty(_class)) {

                delete this.store[i][_class];
            }
        }
    }
};
/**
 * delete classes from all types
 * @param {object} obj class to be deleted from caches
 */
VDRest.Lib.Cache.prototype.invalidateAllTypes = function (obj) {

    var i, _class = obj._class, key = obj.keyInCache;

    for (i in this.store) {

        if (this.store.hasOwnProperty(i)) {

            if (this.store[i].hasOwnProperty(_class) && this.store[i][_class].hasOwnProperty(key)) {

                delete this.store[i][_class][key];
            }
        }
    }
};

/**
 * invalidate all cached classes named _class
 * @param {string} _class
 */
VDRest.Lib.Cache.prototype.invalidateClasses = function (_class) {

    var i;

    for (i in this.store) {

        if (this.store.hasOwnProperty(i)) {

            if (this.store[i].hasOwnProperty(_class)) {

                delete this.store[i][_class];
            }
        }
    }
};

VDRest.Lib.Cache.prototype.updateKeys = function (obj, newkey) {

    var i, _class = obj._class, key = obj.keyInCache, instance;

    for (i in this.store) {

        if (this.store.hasOwnProperty(i)) {

            if (this.store[i].hasOwnProperty(_class) && this.store[i][_class].hasOwnProperty(key)) {

                instance = this.store[i][_class][key];
                instance.keyInCache = newkey;
                delete this.store[i][_class][key];
                this.store[i][_class][newkey] = instance;
            }
        }
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
 * @param {string} obj
 *
 * TODO: interval that invalidates cache entries by specified argument e.g. end_time exceeded
 */
//VDRest.Lib.Cache.prototype.invalidate = function (obj) {
//
//    var key = this.getCacheKey(obj.data, obj.cacheKey), cache;
//
//    if ("undefined" === typeof obj._class) {
//
//        throw new ReferenceError('Cannot determine cache type from object. Property _class not defined in argument obj.');
//    }
//
//    cache = this.getClassCache(obj._class);
//
//    if (cache && "undefined" !== typeof cache[key].canInvalidate && cache[key].canInvalidate) {
//
//        delete cache[key];
//    }
//};

/**
 * retrieve cache
 * @param _class
 * @returns {object}
 */
//VDRest.Lib.Cache.prototype.getClassCache = function (_class) {
//
//    var cache = this.getCacheByType(_class),
//        classCache;
//
//    if (cache) {
//        new RegExp('.*(Model|View|ViewModel|Controller)\\.(.*)').test(_class);
//
//        classCache = RegExp.$2;
//
//        if ("undefined" !== typeof cache[classCache]) {
//
//            cache = cache[classCache];
//        }
//    }
//
//    return cache;
//};

/**
 * retrieve cache type
 * @param {string} _class
 * @returns {string}
 */
//VDRest.Lib.Cache.prototype.getCacheByType = function (_class) {
//
//    var cache = null;
//
//    if (_class.indexOf('.Model.') > -1) {
//        cache = this.store.Model;
//    }
//
//    if (_class.indexOf('.View.') > -1) {
//        cache = this.store.View;
//    }
//
//    if (_class.indexOf('.Controller.') > -1) {
//        cache = this.store.Controller;
//    }
//
//    return cache;
//
//};
