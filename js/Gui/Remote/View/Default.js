/**
 * @class
 * @constructor
 */
Gui.Remote.View.Default = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Remote.View.Default.prototype = new VDRest.Abstract.View();

/**
 * init nodes
 */
Gui.Remote.View.Default.prototype.init = function () {

    this.node = $('<div id="remote">');
    this.buttons = $('<div id="remote-buttons">');
};

/**
 * initialize render
 */
Gui.Remote.View.Default.prototype.render = function () {

    this.buttons.appendTo(this.node);

    this.addButtons();

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * add color buttons
 */
Gui.Remote.View.Default.prototype.addButtons = function () {

    return this;
};
