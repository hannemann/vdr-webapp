
Gui.Epg.Controller.Channels.Channel = function () {};

Gui.Epg.Controller.Channels.Channel.prototype = new VDRest.Abstract.Controller();

Gui.Epg.Controller.Channels.Channel.prototype.cacheKey = 'channel_id';

Gui.Epg.Controller.Channels.Channel.prototype.dispatchView = function (parent) {

    this.module.getView('Channels.Channel', this.data).render(parent);
};
