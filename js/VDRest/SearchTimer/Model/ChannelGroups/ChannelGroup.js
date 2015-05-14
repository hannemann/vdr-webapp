/**
 * Channels resource
 * @constructor
 */
VDRest.SearchTimer.Model.ChannelGroups.ChannelGroup = function () {
};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.SearchTimer.Model.ChannelGroups.ChannelGroup.prototype = new VDRest.Abstract.Model();

/**
 * class name
 * @type {string}
 */
VDRest.SearchTimer.Model.ChannelGroups.ChannelGroup.prototype._class = 'VDRest.SearchTimer.Model.ChannelGroups.ChannelGroup';

/**
 * @type {string}
 */
VDRest.SearchTimer.Model.ChannelGroups.ChannelGroup.prototype.resultJSON = 'groups';

/**
 * @type {string}
 */
VDRest.SearchTimer.Model.ChannelGroups.ChannelGroup.prototype.cacheKey = 'id';
