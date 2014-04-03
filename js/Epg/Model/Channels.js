Epg.Model.Channels = function () {};

Epg.Model.Channels.prototype = new Abstract.Model();

Epg.Model.Channels.prototype._class = 'Epg.Model.Channels';

Epg.Model.Channels.prototype.collectionItemModel = 'Channels.Channel';

Epg.Model.Channels.prototype.resultCollection = 'channels';

Epg.Model.Channels.prototype.events = {

    "collectionloaded" : 'channelsloaded'
};

Epg.Model.Channels.prototype.init = function () {

    this.collection = {};
    this.data.count = 0;
};

//Epg.Model.Channels.prototype.getChannel = function (id) {
//
//    return this.module.getModel('Channels.Channel', id);
//};


Epg.Model.Channels.prototype.initChannels = function () {

    this.module.getResource('Channels').load({
        "url" : 'channelList',
        "callback" : $.proxy(this.processCollection, this)
    });
};
