/**
 * Channels resource
 * @constructor
 */
VDRest.Epg.Model.Channels.Resource = function () {};

/**
 * @type {VDRest.Rest.Api}
 */
VDRest.Epg.Model.Channels.Resource.prototype = new VDRest.Rest.Api();

/**
 * url store
 * @type {{channelList: string}}
 */
VDRest.Epg.Model.Channels.Resource.prototype.urls = {

    "channelList" : "channels/.json"
};
