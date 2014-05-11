/**
 * @class
 * @constructor
 */
Gui.Epg.View.Channels = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Epg.View.Channels.prototype = new VDRest.Abstract.View();

/**
 * initialize view
 */
Gui.Epg.View.Channels.prototype.init = function () {

    this.node = $('<div id="epg-channels">');
};
