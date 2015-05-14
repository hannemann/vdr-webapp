/**
 * Channels resource
 * @constructor
 */
VDRest.SearchTimer.Model.ChannelGroups.ChannelGroup.Resource = function () {
};

/**
 * @type {VDRest.Api.Resource}
 */
VDRest.SearchTimer.Model.ChannelGroups.ChannelGroup.Resource.prototype = new VDRest.Api.Resource();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.SearchTimer.Model.ChannelGroups.ChannelGroup.Resource.prototype._class = 'VDRest.SearchTimer.Model.ChannelGroups.ChannelGroup.Resource';

/**
 * url store
 * @type {Object.<String>}
 */
VDRest.SearchTimer.Model.ChannelGroups.ChannelGroup.Resource.prototype.urls = {

    "channelGroups": "searchtimers/channelgroups.json"
};
