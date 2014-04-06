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
