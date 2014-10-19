/**
 * @class
 * @constructor
 */
Gui.Remote.Controller.NumPad = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Remote.Controller.NumPad.prototype = new VDRest.Abstract.Controller();

/**
 * initialize view
 */
Gui.Remote.Controller.NumPad.prototype.init = function () {

    this.view = this.module.getView('NumPad');
};

/**
 * initialize view
 */
Gui.Remote.Controller.NumPad.prototype.dispatchView = function () {

    this.view.setParentView({
        "node" : this.defaultController.view.buttons
    });

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * add event listeners
 */
Gui.Remote.Controller.NumPad.prototype.addObserver = function () {

    this.view.one   .on('click', $.proxy(this.defaultController.sendKey, this.defaultController, '1'));
    this.view.two   .on('click', $.proxy(this.defaultController.sendKey, this.defaultController, '2'));
    this.view.three .on('click', $.proxy(this.defaultController.sendKey, this.defaultController, '3'));
    this.view.four  .on('click', $.proxy(this.defaultController.sendKey, this.defaultController, '4'));
    this.view.five  .on('click', $.proxy(this.defaultController.sendKey, this.defaultController, '5'));
    this.view.six   .on('click', $.proxy(this.defaultController.sendKey, this.defaultController, '6'));
    this.view.seven .on('click', $.proxy(this.defaultController.sendKey, this.defaultController, '7'));
    this.view.eight .on('click', $.proxy(this.defaultController.sendKey, this.defaultController, '8'));
    this.view.nine  .on('click', $.proxy(this.defaultController.sendKey, this.defaultController, '9'));
    this.view.zero  .on('click', $.proxy(this.defaultController.sendKey, this.defaultController, '0'));
};

/**
 * remove event listeners
 */
Gui.Remote.Controller.NumPad.prototype.removeObserver = function () {

    this.view.one   .off('click');
    this.view.two   .off('click');
    this.view.three .off('click');
    this.view.four  .off('click');
    this.view.five  .off('click');
    this.view.six   .off('click');
    this.view.seven .off('click');
    this.view.eight .off('click');
    this.view.nine  .off('click');
    this.view.zero  .off('click');
};
