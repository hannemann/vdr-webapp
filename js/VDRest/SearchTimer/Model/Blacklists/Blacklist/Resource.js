/**
 * Channels resource
 * @constructor
 */
VDRest.SearchTimer.Model.Blacklists.Blacklist.Resource = function () {
};

/**
 * @type {VDRest.Api.Resource}
 */
VDRest.SearchTimer.Model.Blacklists.Blacklist.Resource.prototype = new VDRest.Api.Resource();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.SearchTimer.Model.Blacklists.Blacklist.Resource.prototype._class = 'VDRest.SearchTimer.Model.Blacklists.Blacklist.Resource';

/**
 * url store
 * @type {Object.<String>}
 */
VDRest.SearchTimer.Model.Blacklists.Blacklist.Resource.prototype.urls = {

    "blacklists": "searchtimers/blacklists.json"
};
