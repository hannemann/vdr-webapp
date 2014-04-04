VDRest.Abstract = VDRest.Abstract || function () {};

/**
 * initialize views cache
 * @constructor
 */
VDRest.Abstract.Controller = function () {

    this.views = {};
};

/**
 * define prototype
 * @type {Lib.Object}
 */
VDRest.Abstract.Controller.prototype = new VDRest.Lib.Object();

/**
 * lazy fetch model and view
 * @param type
 * @return {*}
 */
VDRest.Abstract.Controller.prototype.getView = function (type) {

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
VDRest.Abstract.Controller.prototype.dispatchView = function (type) {

    return this.getView(type).render();
};