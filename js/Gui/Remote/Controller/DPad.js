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

    if (VDRest.helper.isTouchDevice) {
        this.preventReloadHandler = this.preventScrollReload.bind(this);
        this.view.node.on('touchmove', this.preventReloadHandler);
    }
    this.view.up.on('click', this.defaultController.sendKey.bind(this.defaultController, 'Up'));
    this.view.down.on('click', this.defaultController.sendKey.bind(this.defaultController, 'Down'));
    this.view.left.on('click', this.defaultController.sendKey.bind(this.defaultController, 'Left'));
    this.view.right.on('click', this.defaultController.sendKey.bind(this.defaultController, 'Right'));
    this.view.ok.on('click', this.defaultController.sendKey.bind(this.defaultController, 'Ok'));
    this.view.menu.on('click', this.defaultController.sendKey.bind(this.defaultController, 'Menu'));
    this.view.back.on('click', this.defaultController.sendKey.bind(this.defaultController, 'Back'));
    this.view.info.on('click', this.defaultController.sendKey.bind(this.defaultController, 'Info'));
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

    if (VDRest.helper.isTouchDevice) {
        this.view.node.off('touchmove', this.preventReloadHandler);
    }
};
