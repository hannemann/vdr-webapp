/**
 * Channels resource
 * @constructor
 */
VDRest.SearchTimer.Model.Blacklists.Blacklist = function () {
};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.SearchTimer.Model.Blacklists.Blacklist.prototype = new VDRest.Abstract.Model();

/**
 * class name
 * @type {string}
 */
VDRest.SearchTimer.Model.Blacklists.Blacklist.prototype._class = 'VDRest.SearchTimer.Model.Blacklists.Blacklist';

/**
 * @type {string}
 */
VDRest.SearchTimer.Model.Blacklists.Blacklist.prototype.resultJSON = 'blacklists';

/**
 * @type {string}
 */
VDRest.SearchTimer.Model.Blacklists.Blacklist.prototype.cacheKey = 'id';
