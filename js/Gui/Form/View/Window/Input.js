/**
 * @class
 * @constructor
 */
Gui.Form.View.Window.Input = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Form.View.Window.Input.prototype = new Gui.Window.View.Abstract();

/**
 * @type {boolean}
 */
Gui.Form.View.Window.Input.prototype.isModal = true;


Gui.Form.View.Window.Input.prototype.getNode = function () {

    return $('<form class="window">');
};

/**
 * decorate and render
 */
Gui.Form.View.Window.Input.prototype.render = function () {

    var type = this.data.type;

    this.addClasses().addInput().addButtons();

    Gui.Window.View.Abstract.prototype.render.call(this);

    if ("string" === type || "number" === type) {

        this.body.find('input').focus().select();
    }
};

/**
 * add classes
 * @returns {Gui.Form.View.Window.Input}
 */
Gui.Form.View.Window.Input.prototype.addClasses = function () {

    this.node.addClass('window-input clearer');

    if (this.data.className) {
        this.node.addClass(this.data.className);
    }

    return this;
};

/**
 * add form field
 * @returns {Gui.Form.View.Window.Input}
 */
Gui.Form.View.Window.Input.prototype.addInput = function () {

    this.input = this.data.dom.clone();

    if (!this.data.showInfo) {
        this.input.find('.info').remove();
    }

    this.input.appendTo(this.body);

    this.body.find('input').attr('readonly', null);

    return this;
};

/**
 * add buttons
 * @returns {Gui.Form.View.Window.Input}
 */
Gui.Form.View.Window.Input.prototype.addButtons = function () {

    this.cancel = $('<div class="button button-cancel">').text(VDRest.app.translate('Cancel')).appendTo(this.node);

    this.ok = $('<div class="button button-confirm">').text('OK').appendTo(this.node);

    return this;
};