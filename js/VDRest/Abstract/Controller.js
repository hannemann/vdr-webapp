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
 * render view
 */
VDRest.Abstract.Controller.prototype.dispatchView = function () {

    this.view.render();
};