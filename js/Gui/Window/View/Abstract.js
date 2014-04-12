/**
 * @class
 * @constructor
 */
Gui.Window.View.Abstract = function () {};

/**
 * @type {VDRest.Lib.Cache.store.View}
 */
Gui.Window.View.Abstract.prototype = new VDRest.Abstract.View();

/**
 * initialize essentials
 */
Gui.Window.View.Abstract.prototype.init = function () {

    this.node = $('<div class="window">');

    if (this.hasHeader) {
        this.header = $('<div class="window-header clearer">').appendTo(this.node);
        this.node.addClass('has-header');
    }

    this.body = $('<div class="window-body">').appendTo(this.node);

};

/**
 * render essentials
 */
Gui.Window.View.Abstract.prototype.render = function () {

    if (this.hasCloseButton && !this.closeButton) {
        this.addCloseButton();
    }

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * add a button to close the window if configured
 */
Gui.Window.View.Abstract.prototype.addCloseButton = function () {

    this.closeButton = $('<div class="window-close">').html('&#10006;')
        .appendTo(this.node);
};

/**
 * remove window
 */
Gui.Window.View.Abstract.prototype.destruct = function () {

    if (this.hasHeader) {
        this.header.empty();
    }
    this.body.empty();
    this.remove();
};