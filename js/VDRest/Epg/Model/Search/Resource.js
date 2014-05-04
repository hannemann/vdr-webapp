/**
 * EPG Search resource model
 * @constructor
 */
VDRest.Epg.Model.Search.Resource = function () {};

/**
 * @type {VDRest.Api.Resource}
 */
VDRest.Epg.Model.Search.Resource.prototype = new VDRest.Api.Resource();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Epg.Model.Search.Resource.prototype._class = 'VDRest.Epg.Model.Search.Resource';

/**
 * @member {object} urls
 */
VDRest.Epg.Model.Search.Resource.prototype.init = function () {

    this.urls = {
        "search" : "events/search.json"
    };
};