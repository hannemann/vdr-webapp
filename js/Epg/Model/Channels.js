Epg.Model.Channels = function () {};

Epg.Model.Channels.prototype = new Abstract.Model();

Epg.Model.Channels.prototype.init = function () {

    this.channels = {};
    this.count = 0;
};

//Epg.Model.Channels.prototype.getChannel = function (id) {
//
//    return this.module.getModel('Channels.Channel', id);
//};


Epg.Model.Channels.prototype.initChannels = function () {

    this.module.getResource().load('channelList', 'GET', $.proxy(this.processCollection, this));
};

Epg.Model.Channels.prototype.processCollection = function (result) {

    var i = 0, me = this;
    this.count = result.total;

    for (i;i<this.count;i++) {

        Epg.Model.Channels.Channel.prototype.setIdentifier(result.channels[i]);

        this.channels[result.channels[i].id] = this.module.getModel('Channels.Channel', result.channels[i]);
    }

    $.event.trigger({
        "type"      : "channelsLoaded",
        "channels"  : this.channels,
        "_class"    : 'Epg.Model.Channels',
        "iterate"   : me.channelIterator
    });
};

Epg.Model.Channels.prototype.channelIterator = function (callback) {

    var i;

    for (i in this.channels) {

        if (this.channels.hasOwnProperty(i)) {
            callback(this.channels[i]);
        }
    }
};