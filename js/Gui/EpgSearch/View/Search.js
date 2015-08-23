/**
 * @class
 * @constructor
 */
Gui.EpgSearch.View.Search = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.EpgSearch.View.Search.prototype = new VDRest.Abstract.View();

/**
 * render
 */
Gui.EpgSearch.View.Search.prototype.init = function () {

    this.node = $('<div class="epg-search-view window viewport-fullsize collapsed">');
};

/**
 * render
 */
Gui.EpgSearch.View.Search.prototype.render = function () {

    VDRest.Abstract.View.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');
};
