/**
 * @constructor
 */
VDRest.Abstract.Module = function () {};

/**
 * define prototype
 * @type {Lib.Object}
 */
VDRest.Abstract.Module.prototype = new VDRest.Lib.Object();

/**
 * @type {string}
 */
VDRest.Abstract.Module.prototype.namespace = 'VDRest';

/**
 * @type {string}
 */
VDRest.Abstract.Module.prototype.isMuted = false;

/**
 * Initialize module structure
 */
VDRest.Abstract.Module.prototype.init = function () {

    window[this.namespace][this.name].Model = function () {};

    window[this.namespace][this.name].View = function () {};

    window[this.namespace][this.name].ViewModel = function () {};

    window[this.namespace][this.name].Controller = function () {};

    window[this.namespace][this.name].Helper = function () {};

    window[this.namespace][this.name].Controller.Window = function () {};

    window[this.namespace][this.name].View.Window = function () {};

    window[this.namespace][this.name].ViewModel.Window = function () {};

    window[this.namespace][this.name].Helper.Window = function () {};

    this.cache = new VDRest.Lib.Cache();

    this.cache.module = this;
};

/**
 * retrieve model
 * @param {String} type
 * @param {Object} cacheKey
 * @param {Function} callback
 * @return {*}
 */
VDRest.Abstract.Module.prototype.loadModel = function (type, cacheKey, callback) {

    var cache = this.cache.getStore('Model', type),
        path = this.namespace + '.' + this.name + '.Model.' + type,
        constructor,
        model;

    if ("undefined" !== typeof cache[cacheKey]) {

        callback(cache[cacheKey]);

    } else {
        constructor = VDRest.Lib.factory.getConstructor(path);

        this.getResource(type, this.getResourceInitData(path, cacheKey))
            .setIdUrl(cacheKey)
            .load({
                "callback": function (response) {

                    if (response[constructor.prototype.resultJSON][0]) {

                        model = this.getModel(
                            type,
                            response[constructor.prototype.resultJSON][0]
                        );

                    }

                    callback(model);
                }.bind(this),
                "url": "byId"
            }
        );
    }
};

/**
 *
 * @param path
 * @param cacheKey
 * @returns {string}
 */
VDRest.Abstract.Module.prototype.getResourceInitData = function (path, cacheKey) {

    var resourcePath = path + '.Resource',
        resourceConstructor,
        resourceCacheKey,
        resourceId;

    resourceConstructor = VDRest.Lib.factory.getConstructor(resourcePath);
    resourceCacheKey = resourceConstructor.prototype.cacheKey || '';

    resourceId = cacheKey
        .split(this.cache.cacheKeySeparator)
        .slice(0, resourceCacheKey.split(this.cache.cacheKeySeparator).length)
        .join(this.cache.cacheKeySeparator);

    return this.getInitData(resourceId, resourceCacheKey);
};

/**
 * retrieve model
 * @param {String} type
 * @param {Object} [data]
 * @return {*}
 */
VDRest.Abstract.Module.prototype.getModel = function (type, data) {

    return this.getAndInitialize('Model', type, data);
};

/**
 * retrieve viewModel
 * @param {String} type
 * @param {Object} [data]
 * @return {*}
 */
VDRest.Abstract.Module.prototype.getViewModel = function (type, data) {

    return this.getAndInitialize('ViewModel', type, data);
};

/**
 * retrieve controller
 * @param {String} type
 * @param {Object} [data]
 * @return {*}
 */
VDRest.Abstract.Module.prototype.getView = function (type, data) {

    return this.getAndInitialize('View', type, data);
};

/**
 * retrieve controller
 * @param {String} type
 * @param {Object} [data]
 * @return {*}
 */
VDRest.Abstract.Module.prototype.getController = function (type, data) {

    return this.getAndInitialize('Controller', type, data);
};

/**
 * retrieve helper
 * @param {String} [type]
 * @return {*}
 */
VDRest.Abstract.Module.prototype.getHelper = function (type) {

    var cache = this.cache.getStore('Helper'),
        path, instance;

    type = type || 'Default';

    if ("undefined" !== typeof cache[type]) {

        return cache[type];
    }

    path = this.namespace + '.' + this.name + '.Helper.' + type;

    instance = VDRest.Lib.factory.getClass(path);
    instance.module = this;

    return instance;

};

/**
 * retrieve resource model
 * @param {String} type
 * @param {Object} [data]
 * @return {*}
 */
VDRest.Abstract.Module.prototype.getResource = function (type, data) {

    return this.getAndInitialize('Model', type + '.Resource', data);
};

/**
 * retrieve uninitialized instance
 * @param classType
 * @param type
 * @returns {*|_class}
 */
//VDRest.Abstract.Module.prototype.getRaw = function (classType, type) {
//
//    var path = this.namespace + '.' + this.name + '.' + classType + '.' + type,
//        instance = VDRest.Lib.factory.getClass(path);
//    instance.module = this;
//
//    return instance;
//};

/**
 * retrieve initialized instance
 * @param {String} classType
 * @param {String} type
 * @param {Object} [data]
 * @returns {*}
 */
VDRest.Abstract.Module.prototype.getAndInitialize = function (classType, type, data) {

    var instance = this.getClass(classType, type, data);
    instance.module = this;

    if (!instance.initializedData && 'function' === typeof instance.initData) {

        instance.initData(data);
        instance.initializedData = true;
    }

    if (!instance.initialized && 'function' === typeof instance.init) {

        instance.init();
        instance.initialized = true;
    }

    return instance;
};

/**
 * lazy fetching of requested class
 * @param {string} type                     ViewModel, View, Controller
 * @param {string} _class                   classpath
 * @param {(object|string|number)} [data]   data object or identifier
 * @return {*}
 */
VDRest.Abstract.Module.prototype.getClass = function (type, _class, data) {

    var cache = this.cache.getStore(type),
        cacheKey = _class,
        path = this.namespace + '.' + this.name + '.' + type + '.' + _class,
        constructor = VDRest.Lib.factory.getConstructor(path), instance;

    if ("undefined" !== typeof constructor.prototype.cacheKey || (data && data.cacheKey)) {

        cacheKey = constructor.prototype.cacheKey || data.cacheKey;

        if (!(data instanceof Object)) {

            data = this.getInitData(data, cacheKey);
        }

        cache = this.cache.getStore(type, _class);
        cacheKey = this.cache.getCacheKey(data, cacheKey);
    }

    if (constructor.prototype.bypassCache) {
        instance = VDRest.Lib.factory.getClass(path);
        instance.id = cacheKey;
        instance._class = _class;
        return instance;
    }
    if ("undefined" === typeof cache[cacheKey]) {

        instance = VDRest.Lib.factory.getClass(path);
        cache = this.addToCache(cache, cacheKey, instance, _class);
    }

    return cache[cacheKey];
};

/**
 * store instance in cache
 * @param {object} cache
 * @param {string} key
 * @param {VDRest.Lib.Object} instance
 * @param {string} _class
 * @returns {*}
 */
VDRest.Abstract.Module.prototype.addToCache = function (cache, key, instance, _class) {

    cache[key] = instance;
    cache[key].keyInCache = key;
    cache[key].cache = cache;
    cache[key]._class = _class;

    return cache;
};

/**
 * init data object with properties
 * needed to build the cache key
 * only used if we want to fetch
 * an object from cache that has
 * a cacheKey property.
 * Usually an item of a collection
 *
 * @param {(string|number)}     id
 * @param {string}              cacheKey
 * @returns {object}
 */
VDRest.Abstract.Module.prototype.getInitData = function (id, cacheKey) {

    var data = {},
        keys = cacheKey.split(this.cache.cacheKeySeparator),
        ids = id.toString().split(this.cache.cacheKeySeparator),
        i = 0, l = keys.length;

    if (l > 1 && l != ids.length) {

        throw new Error('ID and cacheKey mismatch');
    }

    if (l == 1) {

        data[keys[0]] = id;
    } else {

        for (i; i < l; i++) {

            data[keys[i]] = ids[i];
        }
    }

    return data;
};

/**
 * set muted flag
 */
VDRest.Abstract.Module.prototype.mute = function () {

    this.isMuted = true;
};

/**
 * unset muted flag
 */
VDRest.Abstract.Module.prototype.unMute = function () {

    this.isMuted = false;
};
