/**
 * @constructor
 */
VDRest.Abstract.Controller = function () {
};

/**
 * define prototype
 * @type {Lib.Object}
 */
VDRest.Abstract.Controller.prototype = new VDRest.Lib.Object();

/**
 * initialize views cache
 */
VDRest.Abstract.Controller.prototype.init = function () {

    this.views = {};
};

/**
 * lazy fetch model and view
 * @param {string} type
 * @return {VDRest.Abstract.View}
 */
VDRest.Abstract.Controller.prototype.getView = function (type) {

    if ("undefined" === typeof this.views[type]) {
        // initialize view
        this.views[type] = VDRest.Lib.factory.getClass(this.module.name + '.View.' + type);

        // initialize model
        this.module.getModel(type, {
            "view" : this.views[type],
            "data" : this.getData()
        });
    }

    return this.views[type];
};

/**
 * render view
 */
VDRest.Abstract.Controller.prototype.dispatchView = function () {

    this.view.render();
};