/**
 * Broadcasts resource
 * @constructor
 */
VDRest.Epg.Model.ContentDescriptors.Resource = function () {
};

/**
 * @type {VDRest.Api.Resource}
 */
VDRest.Epg.Model.ContentDescriptors.Resource.prototype = new VDRest.Api.Resource();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Epg.Model.ContentDescriptors.Resource.prototype._class = 'VDRest.Epg.Model.ContentDescriptors.Resource';

/**
 * url store
 * @type {{initial: string}}
 */
VDRest.Epg.Model.ContentDescriptors.Resource.prototype.urls = {

    "initial": "events/contentdescriptors.json"
};
