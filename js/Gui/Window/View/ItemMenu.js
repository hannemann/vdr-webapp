/**
 * @class
 * @constructor
 * @var {object} data
 */
Gui.Window.View.ItemMenu = function () {
};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.ItemMenu.prototype = new Gui.Window.View.Abstract();

/**
 * @type {boolean}
 */
Gui.Window.View.ItemMenu.prototype.isModal = true;

/**
 * initialize node
 */
Gui.Window.View.ItemMenu.prototype.init = function () {

    this.node = $('<div class="window item-menu shadow collapsed">');
};

/**
 * render
 */
Gui.Window.View.ItemMenu.prototype.render = function () {

    this.addClasses().addButtons();

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');
};

Gui.Window.View.ItemMenu.prototype.addClasses = function () {

    this.node.addClass('window-input clearer');

    return this;

};

/**
 * add buttons
 * @returns {Gui.Window.View.ItemMenu}
 */
Gui.Window.View.ItemMenu.prototype.addButtons = function () {

    return this;
};
