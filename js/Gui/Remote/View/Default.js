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

    this.node = $('<div id="remote">').addClass('window collapsed viewport-fullsize');
    this.buttons = $('<div id="remote-buttons" class="clearer">');
};

/**
 * initialize render
 */
Gui.Remote.View.Default.prototype.render = function () {

    this.buttons.appendTo(this.node);

    VDRest.Abstract.View.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');
};
