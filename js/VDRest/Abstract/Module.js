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
 * Initialize module structure
 */
VDRest.Abstract.Module.prototype.init = function () {

    window[this.namespace][this.name].Model = function () {};

    window[this.namespace][this.name].View = function () {};

    window[this.namespace][this.name].ViewModel = function () {};

    window[this.namespace][this.name].Controller = function () {};

    this.cache = new VDRest.Lib.Cache();
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
 * retrieve viewmodel
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
 * retrieve resource model
 * @param {String} type
 * @param {Object} [data]
 * @return {*}
 */
VDRest.Abstract.Module.prototype.getResource = function (type, data) {

    return this.getAndInitialize('Model', type + '.Resource', data);
};

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
        constructor = VDRest.Lib.factory.getConstructor(path);

    if ("undefined" !== typeof constructor.prototype.cacheKey || (data && data.cacheKey)) {

        cacheKey = constructor.prototype.cacheKey || data.cacheKey;

        if (!(data instanceof Object)) {

            data = this.mockInstanceData(data, cacheKey);
        }

        cache = this.cache.getStore(type, _class);
        cacheKey = this.cache.getCacheKey(data, cacheKey);
    }

    if ("undefined" === typeof cache[cacheKey]) {

        cache[cacheKey] = VDRest.Lib.factory.getClass(path, data);
    }

    return cache[cacheKey];
};

/**
 * init data object with properties
 * needed to build the cache key
 * only used if we want to fetch
 * an object from cache that has
 * a cacheKey property.
 * Usually an item of a collection
 *
 * @param {(string|number)} id
 * @param {string}          cacheKey
 * @returns {object}
 */
VDRest.Abstract.Module.prototype.mockInstanceData = function (id, cacheKey) {

    var data = {},
        keys = cacheKey.split(this.cache.cacheKeySeparator),
        ids = id.split(this.cache.cacheKeySeparator),
        i = 0, l = keys.length;

    if (l != ids.length) {

        throw new Error('ID and cacheKey mismatch');
    }

    for (i;i<l;i++) {

        data[keys[i]] = ids[i];
    }

    return data;
};
