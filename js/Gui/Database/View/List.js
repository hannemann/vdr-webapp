/**
 * @class
 * @constructor
 */
Gui.Database.View.List = function () {
};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Database.View.List.prototype = new VDRest.Abstract.View();

/**
 * bypass caching mechanism
 */
Gui.Database.View.List.prototype.bypassCache = true;

/**
 * initialize node
 */
Gui.Database.View.List.prototype.init = function () {

    this.node = $('<div class="database-collection ' + this.id.toLowerCase() + ' database-collection-slider">');
};
