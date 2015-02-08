/**
 * Channels resource
 * @constructor
 */
VDRest.Epg.Model.Channels.Channel.Resource = function () {};

/**
 * @type {VDRest.Api.Resource}
 */
VDRest.Epg.Model.Channels.Channel.Resource.prototype = new VDRest.Api.Resource();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Epg.Model.Channels.Channel.Resource.prototype._class = 'VDRest.Epg.Model.Channels.Channel.Resource';

/**
 * url store
 * @type {{channelList: string}}
 */
VDRest.Epg.Model.Channels.Channel.Resource.prototype.urls = {

    "channelList": "channels.json"
};


VDRest.Epg.Model.Channels.Channel.Resource.prototype.noThrobber = true;

/**
 * url store
 * @type {{channelList: string}}
 * @returns {VDRest.Epg.Model.Channels.Channel.Resource}
 */
VDRest.Epg.Model.Channels.Channel.Resource.prototype.setChannelLimit = function () {

    var startChannel = VDRest.config.getItem('startChannel') - 1,
        limit = VDRest.config.getItem('channelLimit');

    if (limit) {

        this.urls.channelList += '?start='
        +  (startChannel >= 0 ? startChannel : 0)
        + '&limit=' + limit;
    }

    return this;
};

/**
 * set url needed to load single channel
 * @param channel
 * @returns {VDRest.Epg.Model.Channels.Channel.Resource}
 */
VDRest.Epg.Model.Channels.Channel.Resource.prototype.setIdUrl = function (channel) {

    this.urls.byId = 'channels/' + channel + '.json';

    return this;
};