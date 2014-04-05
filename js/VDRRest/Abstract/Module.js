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

    this.cache = {
        "controllers" : {},
        "models" : {}
    }
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

    if (!instance.initialized && 'function' === typeof instance.init) {

        if ('function' === typeof instance.initData) {

            instance.initData(data);
        }

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

    var cache = this.cache[type.toLowerCase() + 's'],
        identifier = _class,
        path = this.namespace + '.' + this.name + '.' + type + '.' + _class,
        constructor = VDRest.Lib.factory.getConstructor(path);

    data = data || {};

    if (constructor.prototype.identifierType === typeof data) {

        data = this.initInstanceData(data, constructor);
    }

    if ("undefined" !== typeof data[constructor.prototype.identifier]) {

        if ("undefined" === typeof cache[_class]) {

            cache[_class] = {};
        }

        cache = cache[_class];
        identifier = data[constructor.prototype.identifier];
    }

    if ("undefined" === typeof cache[identifier]) {

        cache[identifier] = VDRest.Lib.factory.getClass(path, data);
    }

    return cache[identifier];
};

/**
 * init data object with identifier
 * @param {(string|number)} id
 * @param {constructor}     constructor
 * @returns {object}
 */
VDRest.Abstract.Module.prototype.initInstanceData = function (id, constructor) {

    var data = {};
    data[constructor.prototype.identifier] = id;

    return data;
};
