
Gui.Epg.Controller.Channels.Channel = function () {};

Gui.Epg.Controller.Channels.Channel.prototype = new VDRest.Abstract.Controller();

Gui.Epg.Controller.Channels.Channel.prototype.cacheKey = 'channel_id';

Gui.Epg.Controller.Channels.Channel.prototype.init = function () {

    this.view = this.module.getView('Channels.Channel', {
        "channel_id" : this.data.channel_id
    });
    this.view.setParentView(this.data.parent.view);

    this.module.getViewModel('Channels.Channel', {
        "channel_id" : this.data.channel_id,
        "view" : this.view,
        "resource" : this.data.dataModel
    });
};
