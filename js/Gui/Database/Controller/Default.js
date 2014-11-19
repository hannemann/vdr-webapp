/**
 * @class
 * @constructor
 */
Gui.Database.Controller.Default = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Database.Controller.Default.prototype = new VDRest.Abstract.Controller();

/**
 * initialize view
 */
Gui.Database.Controller.Default.prototype.init = function () {

    this.view = this.module.getView('Default', this.data);

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );
};

/**
 * initialize view
 */
Gui.Database.Controller.Default.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

};
