var Abstract = Abstract || function () {};

/**
 * initialize views cache
 * @constructor
 */
Abstract.Controller = function () {

    this.views = {};
};

/**
 * define prototype
 * @type {Lib.Object}
 */
Abstract.Controller.prototype = new Lib.Object();

/**
 * lazy fetch model and view
 * @param type
 * @return {*}
 */
Abstract.Controller.prototype.getView = function (type) {

    if ("undefined" === typeof this.views[type]) {
        // initialize view
        this.views[type] = Lib.factory.getClass(this.module.name + '.View.' + type);

        // initialize model
        this.module.getModel(type, {
            "view" : this.views[type],
            "data" : this.getData()
        });
    }

    return this.views[type];
};

/**
 * retrieve rendered view
 * @param type
 * @return {*}
 */
Abstract.Controller.prototype.dispatchView = function (type) {

    return this.getView(type).render();
};