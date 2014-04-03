Epg.Model.Channels.Channel = function () {};

Epg.Model.Channels.Channel.prototype = new Abstract.Model();

Epg.Model.Channels.Channel.prototype.identifier = 'number';

Epg.Model.Channels.Channel.prototype._class = 'Epg.Model.Channels.Channel';

Epg.Model.Channels.Channel.prototype.collectionItemModel = 'Channels.Channel.Broadcast';

Epg.Model.Channels.Channel.prototype.resultCollection = 'events';

Epg.Model.Channels.Channel.prototype.events = {

    "collectionloaded" : 'eventsloaded'
};

Epg.Model.Channels.Channel.prototype.init = function () {

    this.collection = {};

    this.baseUrl = this.module.getResource('Channels').getBaseUrl();

    if (this.getData('image')) {

        this.setData('image', this.baseUrl + 'channels/image/' + this.getData('channel_id'));
    }

    this.initialized = true;
};

Epg.Model.Channels.Channel.prototype.getBroadcasts = function () {

    this.module.getResource('Channels.Channel')
        .setUrl(this.getData('channel_id'))
        .load({
            "url" : 'broadcastsHourly',
            "callback" : $.proxy(this.processCollection, this)
    });
};

