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

    this.numPad = this.module.getController('NumPad');
    this.numPad.defaultController = this;
    this.dPad = this.module.getController('DPad');
    this.dPad.defaultController = this;

    this.numPad.dispatchView();
    this.dPad.dispatchView();

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

};

/**
 * send key
 * @param {String} key
 * @param {jQuery.Event} e
 */
Gui.Remote.Controller.Default.prototype.sendKey = function (key, e) {

    e.preventDefault();
    e.stopPropagation();

    this.vibrate();
    this.module.backend.send(key);
};
