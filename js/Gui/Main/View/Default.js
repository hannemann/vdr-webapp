/**
 * @class
 * @constructor
 */
Gui.Main.View.Default = function () {
};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Main.View.Default.prototype = new VDRest.Abstract.View();

/**
 * init nodes
 */
Gui.Main.View.Default.prototype.init = function () {

    this.node = $('body');
};

/**
 * render
 */
Gui.Main.View.Default.prototype.render = function () {
};