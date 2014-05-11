/**
 * @class
 * @constructor
 */
Gui.Epg.View.Epg = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Epg.View.Epg.prototype = new VDRest.Abstract.View();

/**
 * initialize view
 */
Gui.Epg.View.Epg.prototype.init = function () {

    this.node = $('<div id="epg" class="clearer">');
};
