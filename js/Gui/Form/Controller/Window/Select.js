/**
 * @class
 * @constructor
 */
Gui.Form.Controller.Window.Select = function () {};

/**
 * @type {Gui.Window.ViewModel.Input}
 */
Gui.Form.Controller.Window.Select.prototype = new Gui.Form.Controller.Window.Input();

/**
 * initialize view
 */
Gui.Form.Controller.Window.Select.prototype.init = function () {

    this.eventPrefix = 'window.select';

    this.view = this.module.getView('Window.Select', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * dispatch
 */
Gui.Form.Controller.Window.Select.prototype.dispatchView = function () {

    if ("function" === typeof this.data.renderBefore) {
        this.data.renderBefore();
    }

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    this.addObserver();
    this.setPosition();
};