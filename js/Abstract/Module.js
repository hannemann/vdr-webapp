var Abstract = Abstract || function () {};

/**
 * @constructor
 */
Abstract.Module = function () {};

/**
 * define prototype
 * @type {Lib.Object}
 */
Abstract.Module.prototype = new Lib.Object();

/**
 * Initialize module structure
 */
Abstract.Module.prototype.init = function () {

    window[this.name].Model = function () {};

    window[this.name].View = function () {};

    window[this.name].Controller = function () {};

    this.cache = {
        "controllers" : {},
        "models" : {}
    }
};

/**
 * retrieve model
 * @param type {String}
 * @param [data] {Object}
 * @return {*}
 */
Abstract.Module.prototype.getModel = function (type, data) {

    return this.getAndInitialize('Model', type, data);
};

/**
 * retrieve controller
 * @param type {String}
 * @param [data] {Object|undefined}
 * @return {*}
 */
Abstract.Module.prototype.getController = function (type, data) {

    return this.getAndInitialize('Controller', type, data);
};

/**
 * retrieve resource model
 * @param type {String}
 * @return {*}
 */
Abstract.Module.prototype.getResource = function (type, data) {

    return this.getAndInitialize('Model', type + '.Resource', data);
};

/**
 * retrieve initialized instance
 * @param classType {String}
 * @param type {String}
 * @param [data] {Object|undefined}
 * @returns {*}
 */
Abstract.Module.prototype.getAndInitialize = function (classType, type, data) {

    var instance = this.getClass(classType, type, data);
    instance.module = this;

    if (!instance.initialized && 'function' === typeof instance.init) {

        instance.init();
        instance.initialized = true;
    }

    return instance;
};

/**
 * lazy fetching of requested class
 * @param type {String}
 * @param _class {String}
 * @param [data] {Object|undefined}
 * @return {*}
 */
Abstract.Module.prototype.getClass = function (type, _class, data) {

    var cache = this.cache[type.toLowerCase() + 's'],
        identifier = _class,
        path = this.name + '.' + type + '.' + _class,
        constructor = Lib.factory.getConstructor(path);

    data = data || {};

    if ("number" === typeof data) {

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

        cache[identifier] = Lib.factory.getClass(path, data);
    }

    return cache[identifier];
};

/**
 * init data object with identifier
 * @param id
 * @param constructor
 * @returns {{}}
 */
Abstract.Module.prototype.initInstanceData = function (id, constructor) {

    var data = {};
    data[constructor.prototype.identifier] = id;

    return data;
};
