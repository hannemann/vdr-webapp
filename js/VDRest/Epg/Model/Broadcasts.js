/**
 * @class
 * @constructor
 */
VDRest.Epg.Model.Broadcasts = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Epg.Model.Broadcasts.prototype = new VDRest.Abstract.Model();

/**
 * load initial broadcasts
 */
VDRest.Epg.Model.Broadcasts.prototype.initBroadcasts = function () {

    var resource = this.module.getResource('Broadcasts');

    resource
        .setChannelLimit()
        .load({
            "url" : "initial",
            "callback" : $.proxy(this.processCollection, this)
        });
};

/**
 * process initial events collection
 * @param result
 */
VDRest.Epg.Model.Broadcasts.prototype.processCollection = function (result) {

    var i = 0, l=result.count, broadcast, channel;

    for (i;i<l;i++) {

        broadcast = this.module.getModel('Channels.Channel.Broadcast', result.events[i]);

        channel = this.module.getModel('Channels.Channel', broadcast.getData('channel')).collection.push(broadcast);

    }

    $.event.trigger('broadcastsloaded');
};
