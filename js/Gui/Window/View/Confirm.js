
Gui.Window.View.Confirm = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.Confirm.prototype = new Gui.Window.View.Input();

Gui.Window.View.Confirm.prototype.isModal = true;

Gui.Window.View.Confirm.prototype.cacheKey = 'id';

Gui.Window.View.Confirm.prototype.render = function () {

    this.addClasses().addMessage().addButtons();

    this.node.addClass('collapsed');

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');
};

Gui.Window.View.Confirm.prototype.addMessage = function () {

    $('<div class="confirm-message">').text(this.data.message).appendTo(this.body);

    return this;
};