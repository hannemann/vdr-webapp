
Gui.Window.View.Input = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.Input.prototype = new Gui.Window.View.Abstract();

Gui.Window.View.Input.prototype.isModal = true;

Gui.Window.View.Input.prototype.render = function () {

    var type = this.data.type;

    this.addClasses().addInput().addButtons();

    Gui.Window.View.Abstract.prototype.render.call(this);

    if ("string" === type || "number" === type) {

        this.body.find('input').focus();
    }
};

Gui.Window.View.Input.prototype.addClasses = function () {

    this.node.addClass('window-input clearer');

    return this;
};

Gui.Window.View.Input.prototype.addInput = function () {

    this.input = this.data.dom.clone().appendTo(this.body);

    this.body.find('input').attr('readonly', null);

    return this;
};

Gui.Window.View.Input.prototype.addButtons = function () {

    this.cancel = $('<div class="button button-cancel">').text('Cancel').appendTo(this.body);

    this.ok = $('<div class="button button-confirm">').text('OK').appendTo(this.body);

    return this;
};