
Gui.Window.View.Confirm = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.Confirm.prototype = new Gui.Window.View.Input();

Gui.Window.View.Input.prototype.isModal = true;

Gui.Window.View.Input.prototype.cacheKey = 'id';

Gui.Window.View.Input.prototype.render = function () {

    this.addClasses().addMessage().addButtons();

    Gui.Window.View.Abstract.prototype.render.call(this);
};

Gui.Window.View.Input.prototype.addMessage = function () {

    $('<div class="confirm-message">').text(this.data.message).appendTo(this.body);

    return this;
};