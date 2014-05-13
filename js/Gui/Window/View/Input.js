/**
 * @class
 * @constructor
 */
Gui.Window.View.Input = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.Input.prototype = new Gui.Window.View.Abstract();

/**
 * @type {boolean}
 */
Gui.Window.View.Input.prototype.isModal = true;

/**
 * decorate and render
 */
Gui.Window.View.Input.prototype.render = function () {

    var type = this.data.type;

    this.addClasses().addInput().addButtons();

    Gui.Window.View.Abstract.prototype.render.call(this);

    if ("string" === type || "number" === type) {

        this.body.find('input').focus();
    }
};

/**
 * add classes
 * @returns {Gui.Window.View.Input}
 */
Gui.Window.View.Input.prototype.addClasses = function () {

    this.node.addClass('window-input clearer');

    return this;
};

/**
 * add form field
 * @returns {Gui.Window.View.Input}
 */
Gui.Window.View.Input.prototype.addInput = function () {

    this.input = this.data.dom.clone().appendTo(this.body);

    this.body.find('input').attr('readonly', null);

    return this;
};

/**
 * add buttons
 * @returns {Gui.Window.View.Input}
 */
Gui.Window.View.Input.prototype.addButtons = function () {

    this.cancel = $('<div class="button button-cancel">').text(VDRest.app.translate('Cancel')).appendTo(this.node);

    this.ok = $('<div class="button button-confirm">').text('OK').appendTo(this.node);

    return this;
};