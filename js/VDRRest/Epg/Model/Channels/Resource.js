/**
 * Channels resource
 * @constructor
 */
VDRest.Epg.Model.Channels.Resource = function () {};

/**
 * @type {VDRest.Api}
 */
VDRest.Epg.Model.Channels.Resource.prototype = new VDRest.Api();

/**
 * url store
 * @type {{channelList: string}}
 */
VDRest.Epg.Model.Channels.Resource.prototype.urls = {

    "channelList" : "channels/.json"
};
