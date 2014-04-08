
Gui.Epg.View.Channels = function () {};

Gui.Epg.View.Channels.prototype = new VDRest.Abstract.View();

Gui.Epg.View.Channels.prototype.init = function () {

    this.node = $('<div id="epg-channels">');
};
