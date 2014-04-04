VDRest.Epg.Model.Channels = function () {};

VDRest.Epg.Model.Channels.prototype = new VDRest.Abstract.Model();

VDRest.Epg.Model.Channels.prototype._class = 'Epg.Model.Channels';

VDRest.Epg.Model.Channels.prototype.collectionItemModel = 'Channels.Channel';

VDRest.Epg.Model.Channels.prototype.resultCollection = 'channels';

VDRest.Epg.Model.Channels.prototype.events = {

    "collectionloaded" : 'channelsloaded'
};

VDRest.Epg.Model.Channels.prototype.init = function () {

    this.collection = {};
    this.data.count = 0;
};

//Epg.Model.Channels.prototype.getChannel = function (id) {
//
//    return this.module.getModel('Channels.Channel', id);
//};


VDRest.Epg.Model.Channels.prototype.initChannels = function () {

    this.module.getResource('Channels').load({
        "url" : 'channelList',
        "callback" : $.proxy(this.processCollection, this)
    });
};
