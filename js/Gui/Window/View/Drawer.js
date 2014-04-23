/**
 * @class
 * @constructor
 */
Gui.Window.View.Drawer = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.Drawer.prototype = new Gui.Window.View.Abstract();

/**
 * is modal within viewport
 * @type {boolean}
 */
Gui.Window.View.Drawer.prototype.isModalViewport = true;

/**
 * is transparent modal
 * @type {boolean}
 */
Gui.Window.View.Drawer.prototype.isModalTransparent = true;

Gui.Window.View.Drawer.prototype.hasHeader = true;

/**
 * draw
 */
Gui.Window.View.Drawer.prototype.render = function () {

    this.header.text('Menu');

    this.buttons = [];

    this.addClasses().addButtons();

    Gui.Window.View.Abstract.prototype.render.call(this);
};

/**
 * add needed classes
 * @returns {Gui.Window.View.Drawer}
 */
Gui.Window.View.Drawer.prototype.addClasses = function () {

    this.node.addClass('window-drawer clearer');

    return this;
};

/**
 * add Buttons
 * @returns {Gui.Window.View.Drawer}
 */
Gui.Window.View.Drawer.prototype.addButtons = function () {

    this.getButtons().each($.proxy(function (module, options) {

        this.buttons.push(
            $('<div class="navi-button">')
                .attr('data-module', module)
                .text(options.headline)
                .addClass(options.current ? 'current' : '')
                .appendTo(this.body)
        );

    }, this));

    return this;
};
