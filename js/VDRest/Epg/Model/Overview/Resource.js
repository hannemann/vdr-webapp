/**
 * Broadcasts resource
 * @constructor
 */
VDRest.Epg.Model.Overview.Resource = function () {};

/**
 * @type {VDRest.Api.Resource}
 */
VDRest.Epg.Model.Overview.Resource.prototype = new VDRest.Api.Resource();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Epg.Model.Overview.Resource.prototype._class = 'VDRest.Epg.Model.Broadcasts.Resource';

/**
 * base search url
 * @type {string}
 */
VDRest.Epg.Model.Overview.Resource.prototype.baseSearchUrl = 'events/search.json?date_limit=';

/**
 * url store
 * @type {Object.<string, string>}
 */
VDRest.Epg.Model.Overview.Resource.prototype.urls = {

    "search" : ""
};
