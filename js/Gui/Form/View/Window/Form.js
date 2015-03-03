/**
 * @class
 * @constructor
 */
Gui.Form.View.Window.Form = function () {
};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Form.View.Window.Form.prototype = new Gui.Window.View.Abstract();

/**
 * @type {boolean}
 */
Gui.Form.View.Window.Form.prototype.isModal = true;

/**
 * @type {boolean}
 */
Gui.Form.View.Window.Form.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Form.View.Window.Form.prototype.init = function () {

    Gui.Window.View.Abstract.prototype.init.call(this);
};

/**
 * decorate and render
 */
Gui.Form.View.Window.Form.prototype.render = function () {

    this.addClasses()
        .addButtons();
    Gui.Window.View.Abstract.prototype.render.call(this);
    this.node.toggleClass('collapsed expand');
};

/**
 * add class names
 * @returns {Gui.Form.View.Window.Form}
 */
Gui.Form.View.Window.Form.prototype.addClasses = function () {

    this.node.addClass('collapsed form-window window-input');
    return this;
};

/**
 * add buttons
 * @returns {Gui.Window.View.Input}
 */
Gui.Form.View.Window.Form.prototype.addButtons = function () {

    this.cancel = $('<div class="button button-cancel">').text(VDRest.app.translate('Cancel')).appendTo(this.node);
    this.ok = $('<div class="button button-confirm">').text('OK').appendTo(this.node);
    return this;
};