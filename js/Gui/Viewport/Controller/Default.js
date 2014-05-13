/**
 * @class
 * @constructor
 */
Gui.Viewport.Controller.Default = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Viewport.Controller.Default.prototype = new VDRest.Abstract.Controller();

/**
 * initialize view
 */
Gui.Viewport.Controller.Default.prototype.init = function () {

    this.view = this.module.getView('Default');
};
