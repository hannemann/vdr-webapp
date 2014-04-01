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
 * @param data {Object|undefined}
 * @return {*}
 */
Abstract.Module.prototype.getModel = function (type, data) {

    return this.getClass('Model', type, data);
};

/**
 * retrieve controller
 * @param type {String}
 * @param data {Object|undefined}
 * @return {*}
 */
Abstract.Module.prototype.getController = function (type, data) {

    var controller = this.getClass('Controller', type, data);
    controller.module = this;

    return controller;
};

/**
 * lazy fetching of requested class
 * @param type {String}
 * @param viewType {String}
 * @param data {Object|undefined}
 * @return {*}
 */
Abstract.Module.prototype.getClass = function (type, viewType, data) {

    var cache = this.cache[type.toLowerCase() + 's'],
        identifier = viewType;

    if ("undefined" !== typeof data.id) {

        if ("undefined" === typeof cache[viewType]) {
            cache[viewType] = {};
        }
        identifier = data.id;
        cache = cache[viewType];
    }

    if ("undefined" === typeof cache[identifier]) {

        data = data || {};

        cache[identifier] = Lib.factory.getClass(this.name + '.' + type + '.' + viewType, data);
    }

    return cache[identifier];
};
