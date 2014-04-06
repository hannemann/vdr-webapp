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

    window.VDRest[this.name].Model = function () {};

    window.VDRest[this.name].View = function () {};

    window.VDRest[this.name].Controller = function () {};

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
 * @param {string} type                     Model, View, Controller
 * @param {string} _class                   classpath
 * @param {(object|string|number)} [data]   data object or identifier
 * @return {*}
 */
VDRest.Abstract.Module.prototype.getClass = function (type, _class, data) {

    var cache = this.cache.getStore(type),
        cacheKey = _class,
        path = this.namespace + '.' + this.name + '.' + type + '.' + _class,
        constructor = VDRest.Lib.factory.getConstructor(path);

    if ("undefined" !== typeof constructor.prototype.cacheKey) {

        if (!(data instanceof Object)) {

            data = this.initInstanceData(data, constructor.prototype.cacheKey);
        }

        cache = this.cache.getStore(type, _class);
        cacheKey = this.cache.getCacheKey(data, constructor.prototype.cacheKey);
    }

    if ("undefined" === typeof cache[cacheKey]) {

        cache[cacheKey] = VDRest.Lib.factory.getClass(path, data);
    }

    return cache[cacheKey];
};

/**
 * init data object with identifier
 * @param {(string|number)} id
 * @param {string}     cacheKey
 * @returns {object}
 */
VDRest.Abstract.Module.prototype.initInstanceData = function (id, cacheKey) {

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
