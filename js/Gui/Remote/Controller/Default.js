/**
 * @class
 * @constructor
 */
Gui.Remote.Controller.Default = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Remote.Controller.Default.prototype = new VDRest.Abstract.Controller();

/**
 * initialize view
 */
Gui.Remote.Controller.Default.prototype.init = function () {

    this.view = this.module.getView('Default', this.data);

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );
};

/**
 * initialize view
 */
Gui.Remote.Controller.Default.prototype.dispatchView = function () {

    this.module.getController('NumPad').dispatchView();
    this.module.getController('DPad').dispatchView();

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

};

/**
 * send key
 */
Gui.Remote.Controller.Default.prototype.sendKey = function (key) {

    this.module.backend.send(key);
};
