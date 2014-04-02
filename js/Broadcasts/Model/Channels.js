Broadcasts.Model.Channels = function () {};

Broadcasts.Model.Channels.prototype = new Abstract.Model();

Broadcasts.Model.Channels.prototype.init = function () {

    this.channels = {};
    this.count = 0;
};

//Broadcasts.Model.Channels.prototype.getChannel = function (id) {
//
//    return this.module.getModel('Channels.Channel', id);
//};


Broadcasts.Model.Channels.prototype.initChannels = function () {

    this.module.getResource().load('channelList', 'GET', $.proxy(this.processCollection, this));
};

Broadcasts.Model.Channels.prototype.processCollection = function (result) {

    var i = 0, me = this;
    this.count = result.total;

    for (i;i<this.count;i++) {

        Broadcasts.Model.Channels.Channel.prototype.setIdentifier(result.channels[i]);

        this.channels[result.channels[i].id] = this.module.getModel('Channels.Channel', result.channels[i]);
    }

    $.event.trigger({
        "type"      : "channelsLoaded",
        "channels"  : this.channels,
        "_class"    : 'Broadcasts.Model.Channels',
        "iterate"   : me.channelIterator
    });
};

Broadcasts.Model.Channels.prototype.channelIterator = function (callback) {

    var i;

    for (i in this.channels) {

        if (this.channels.hasOwnProperty(i)) {
            callback(this.channels[i]);
        }
    }
};