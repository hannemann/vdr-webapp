/**
 * @class
 * @constructor
 */
Gui.Database.View.List.Item.Abstract = function () {
};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Database.View.List.Item.Abstract.prototype = new VDRest.Abstract.View();

/**
 * @type {boolean}
 */
Gui.Database.View.List.Item.Abstract.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Database.View.List.Item.Abstract.prototype.init = function () {

    this.node = $('<div class="clearer item-' + this.className + '">');
};

/**
 * render view
 */
Gui.Database.View.List.Item.Abstract.prototype.render = function () {

    VDRest.Abstract.View.prototype.render.call(this);
};
