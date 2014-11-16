/**
 * @class
 * @constructor
 */
Gui.Database.View.Default = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Database.View.Default.prototype = new VDRest.Abstract.View();

/**
 * init nodes
 */
Gui.Database.View.Default.prototype.init = function () {

    this.node = $('<div id="remote">');
    this.buttons = $('<div id="remote-buttons" class="clearer">');
};

/**
 * initialize render
 */
Gui.Database.View.Default.prototype.render = function () {

    this.buttons.appendTo(this.node);

    VDRest.Abstract.View.prototype.render.call(this);
};
