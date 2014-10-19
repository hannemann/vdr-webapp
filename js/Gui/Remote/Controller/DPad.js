/**
 * @class
 * @constructor
 */
Gui.Remote.Controller.DPad = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Remote.Controller.DPad.prototype = new VDRest.Abstract.Controller();

/**
 * initialize view
 */
Gui.Remote.Controller.DPad.prototype.init = function () {

    this.view = this.module.getView('DPad');
};

/**
 * initialize view
 */
Gui.Remote.Controller.DPad.prototype.dispatchView = function () {

    this.view.setParentView({
        "node" : this.defaultController.view.buttons
    });

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * add event listeners
 */
Gui.Remote.Controller.DPad.prototype.addObserver = function () {

    this.view.up    .on('click', $.proxy(this.defaultController.sendKey, this.defaultController, 'Up'));
    this.view.down  .on('click', $.proxy(this.defaultController.sendKey, this.defaultController, 'Down'));
    this.view.left  .on('click', $.proxy(this.defaultController.sendKey, this.defaultController, 'Left'));
    this.view.right .on('click', $.proxy(this.defaultController.sendKey, this.defaultController, 'Right'));
    this.view.ok    .on('click', $.proxy(this.defaultController.sendKey, this.defaultController, 'Ok'));
    this.view.menu  .on('click', $.proxy(this.defaultController.sendKey, this.defaultController, 'Menu'));
    this.view.back  .on('click', $.proxy(this.defaultController.sendKey, this.defaultController, 'Back'));
    this.view.info  .on('click', $.proxy(this.defaultController.sendKey, this.defaultController, 'Info'));
};

/**
 * remove event listeners
 */
Gui.Remote.Controller.DPad.prototype.removeObserver = function () {

    this.view.up    .off('click');
    this.view.down  .off('click');
    this.view.left  .off('click');
    this.view.right .off('click');
    this.view.ok    .off('click');
    this.view.menu  .off('click');
    this.view.back  .off('click');
    this.view.info  .off('click');
};
