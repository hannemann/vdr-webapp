
Gui.Epg.View.Channels = function () {};

Gui.Epg.View.Channels.prototype = new VDRest.Abstract.View();

Gui.Epg.View.Channels.prototype.init = function (epg) {

    this.channels = $('<div id="epg-channels">');
};

Gui.Epg.View.Channels.prototype.render = function (epg) {

    return this.channels;
};