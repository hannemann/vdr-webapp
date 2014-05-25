/**
 * Broadcasts resource
 * @constructor
 */
VDRest.Epg.Model.Broadcasts.Resource = function () {};

/**
 * @type {VDRest.Api.Resource}
 */
VDRest.Epg.Model.Broadcasts.Resource.prototype = new VDRest.Api.Resource();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Epg.Model.Broadcasts.Resource.prototype._class = 'VDRest.Epg.Model.Broadcasts.Resource';

/**
 * url store
 * @type {{channelList: string}}
 */
VDRest.Epg.Model.Broadcasts.Resource.prototype.urls = {

    "initial" : "events.json?timespan=21600"
};

/**
 * set channels limit
 * @returns {VDRest.Epg.Model.Broadcasts.Resource}
 */
VDRest.Epg.Model.Broadcasts.Resource.prototype.setChannelLimit = function () {

    var startChannel = VDRest.config.getItem('startChannel') - 1,
        limit = VDRest.config.getItem('channelLimit');

    if (limit) {

        this.urls.initial += '&chfrom='
        +  (startChannel >= 0 ? startChannel : 0)
        + '&chto=' + limit;
    }

    return this;
};

/**
 * set url needed to load single broadcast
 * @param channel
 * @returns {VDRest.Epg.Model.Broadcasts.Resource}
 */
//VDRest.Epg.Model.Broadcasts.Resource.prototype.setIdUrl = function (channel) {
//
//    this.urls.byId = 'channels/' + channel + '.json';
//
//    return this;
//};
