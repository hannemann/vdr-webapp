Epg.Model.Channels.Channel = function () {};

Epg.Model.Channels.Channel.prototype = new Abstract.Model();

Epg.Model.Channels.Channel.prototype.identifier = 'number';

Epg.Model.Channels.Channel.prototype._class = 'Epg.Model.Channels.Channel';

Epg.Model.Channels.Channel.prototype.collectionItemModel = 'Channels.Channel.Broadcast';

Epg.Model.Channels.Channel.prototype.resultCollection = 'events';

Epg.Model.Channels.Channel.prototype.lastEventEnd = 0;

Epg.Model.Channels.Channel.prototype.init = function () {

    var channelId = this.getData('channel_id');

    this.collection = {};
    this.data.count = 0;
    this.events = {

        "collectionloaded" : 'eventsloaded-' + channelId
    };

    this.baseUrl = this.module.getResource('Channels').getBaseUrl();

    if (this.getData('image')) {

        this.setData('image', this.baseUrl + 'channels/image/' + channelId);
    }
};

Epg.Model.Channels.Channel.prototype.getBroadcasts = function () {

    this.module.getResource('Channels.Channel', {

        "channelId":this.getData('channel_id')

    }).setHourlyUrl()
        .load({
            "url" : 'broadcastsHourly',
            "callback" : $.proxy(this.processCollection, this)
    });
};

Epg.Model.Channels.Channel.prototype.afterCollectionLoaded = function () {
//    console.log(this);
};

