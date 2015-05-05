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

    this.addClasses().addHeader().addButtons();

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');
};

Gui.Window.View.ItemMenu.prototype.addClasses = function () {

    this.node.addClass('window-item-menu clearer');

    return this;

};

/**
 * add header
 * @returns {Gui.Window.View.ItemMenu}
 */
Gui.Window.View.ItemMenu.prototype.addHeader = function () {

    var header;

    if ("undefined" !== this.data.config.header) {

        header = $('<div>').addClass('header').html(this.data.config.header);
        header.appendTo(this.node);
    }

    return this;
};

/**
 * add buttons
 * @returns {Gui.Window.View.ItemMenu}
 */
Gui.Window.View.ItemMenu.prototype.addButtons = function () {

    var buttons = this.data.config.buttons,
        i,
        button;

    for (i in buttons) {
        if (buttons.hasOwnProperty(i)) {
            button = $('<div>').addClass('button');

            button.html(buttons[i].label);
            button.appendTo(this.node);

            this[i + 'Button'] = button;
        }
    }

    return this;
};
