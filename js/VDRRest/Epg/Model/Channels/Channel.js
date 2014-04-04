VDRest.Epg.Model.Channels.Channel = function () {};

VDRest.Epg.Model.Channels.Channel.prototype = new VDRest.Abstract.Model();

VDRest.Epg.Model.Channels.Channel.prototype.identifier = 'number';

VDRest.Epg.Model.Channels.Channel.prototype._class = 'VDRest.Epg.Model.Channels.Channel';

VDRest.Epg.Model.Channels.Channel.prototype.collectionItemModel = 'Channels.Channel.Broadcast';

VDRest.Epg.Model.Channels.Channel.prototype.resultCollection = 'events';

VDRest.Epg.Model.Channels.Channel.prototype.lastEventEnd = 0;

VDRest.Epg.Model.Channels.Channel.prototype.init = function () {

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

VDRest.Epg.Model.Channels.Channel.prototype.getBroadcasts = function () {

    this.module.getResource('Channels.Channel', {

        "channelId":this.getData('channel_id')

    }).setHourlyUrl()
        .load({
            "url" : 'broadcastsHourly',
            "callback" : $.proxy(this.processCollection, this)
    });
};

VDRest.Epg.Model.Channels.Channel.prototype.afterCollectionLoaded = function () {
//    console.log(this);
};

