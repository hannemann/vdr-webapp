
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

Gui.Epg.Controller.Channels.Channel.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addDomEvents();
};

Gui.Epg.Controller.Channels.Channel.prototype.addDomEvents = function () {

    var me = this,
        streamUrl = 'http://'
            + VDRest.config.getItem('host')
            + ':'
            + VDRest.config.getItem('streamdev-port')
            + '/' + VDRest.config.getItem('streamdev-params') + '/'
            + this.data.dataModel.data.stream;

    this.view.node.on('mouseup', function () {
        var channel = $(this).attr('data-channel-id');

        if ("undefined" !== typeof me.preventClick) {

            return false;
        } else {
            if ("undefined" !== typeof me.channelClickTimeout) {
                window.clearTimeout(me.channelClickTimeout);
            }
//            main.modules.channel.next = me.channels[$(this).attr('data-channelsid')];
//            main.dispatch('channel');
        }

    }).on('mousedown', function (e) {

        me.preventClick = undefined;
        me.channelClickTimeout = window.setTimeout(function () {
            me.preventClick = true;
            e.preventDefault();
            window.location.href = streamUrl;
        }, 1000);
    });
};
