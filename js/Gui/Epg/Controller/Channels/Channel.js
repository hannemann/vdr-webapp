
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

    this.streamUrl = 'http://'
        + VDRest.config.getItem('host')
        + ':'
        + VDRest.config.getItem('streamdevPort')
        + '/' + VDRest.config.getItem('streamdevParams') + '/'
        + this.data.dataModel.data.stream;
};

Gui.Epg.Controller.Channels.Channel.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

Gui.Epg.Controller.Channels.Channel.prototype.addObserver = function () {

    this.view.node
        .on('mouseup', $.proxy(this.handleUp, this))
        .on('mousedown', $.proxy(this.handleDown, this));
};

Gui.Epg.Controller.Channels.Channel.prototype.removeObserver = function () {

    this.view.node
        .off('mouseup', $.proxy(this.handleUp, this))
        .off('mousedown', $.proxy(this.handleDown, this));
};

Gui.Epg.Controller.Channels.Channel.prototype.handleUp = function (e) {

    var channel = $(e.currentTarget).attr('data-channel-id');

    if ("undefined" !== typeof this.preventClick) {

        return false;
    } else {
        if ("undefined" !== typeof this.channelClickTimeout) {
            window.clearTimeout(this.channelClickTimeout);
        }
//            main.modules.channel.next = me.channels[$(this).attr('data-channelsid')];
//            main.dispatch('channel');
    }

};

Gui.Epg.Controller.Channels.Channel.prototype.handleDown = function (e) {

    this.preventClick = undefined;
    this.channelClickTimeout = window.setTimeout($.proxy(function () {
        this.preventClick = true;
        e.preventDefault();
        window.location.href = this.streamUrl;
    }, this), 1000);
};
