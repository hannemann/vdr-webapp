/**
 * Channels resource
 * @constructor
 */
VDRest.Epg.Model.Channels.Channel.Resource = function () {};

/**
 * @type {VDRest.Rest.Api}
 */
VDRest.Epg.Model.Channels.Channel.Resource.prototype = new VDRest.Rest.Api();

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

    "channelList" : "channels/.json"
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