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

Gui.Epg.View.Channels.prototype.setHeight = function (height) {

    this.node[0].style.height = parseInt(height, 10).toString() + 'px';
};

Gui.Epg.View.Channels.prototype.unsetHeight = function () {

    this.node[0].style.height = '';
};
