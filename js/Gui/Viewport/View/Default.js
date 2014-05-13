/**
 * @class
 * @constructor
 */
Gui.Viewport.View.Default = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Viewport.View.Default.prototype = new VDRest.Abstract.View();

/**
 * init nodes
 */
Gui.Viewport.View.Default.prototype.init = function () {

    this.node = $('<div id="viewport">');

    $('body').addClass(VDRest.config.getItem('theme'));
};

/**
 * render
 */
Gui.Viewport.View.Default.prototype.render = function () {

    this.node.appendTo('body');
};