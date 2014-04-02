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
 * @param [data] {Object|undefined}
 * @return {*}
 */
Abstract.Module.prototype.getModel = function (type, data) {

    var model = this.getClass('Model', type, data);
    model.module = this;

    if ('function' === typeof model.init) {

        model.init();
    }

    return model;
};

/**
 * retrieve controller
 * @param type {String}
 * @param [data] {Object|undefined}
 * @return {*}
 */
Abstract.Module.prototype.getController = function (type, data) {

    var controller = this.getClass('Controller', type, data);
    controller.module = this;

    if ('function' === typeof controller.init) {

        controller.init();
    }

    return controller;
};

/**
 * retrieve resource model
 * @return {*}
 */
Abstract.Module.prototype.getResource = function () {

    return this.getClass('Model', 'Resource');
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
        path = this.name + '.' + type + '.' + _class;

    data = data || {};

    if ("number" === typeof data) {

        data = { "id" : data }
    }

    if ("undefined" !== typeof data.id) {

        if ("undefined" === typeof cache[_class]) {
            cache[_class] = {};
        }
        identifier = data.id;
        cache = cache[_class];
    }

    if ("undefined" === typeof cache[identifier]) {

        cache[identifier] = Lib.factory.getClass(path, data);
    }

    return cache[identifier];
};
