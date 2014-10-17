/**
 * Channels resource
 * @constructor
 */
VDRest.Osd.Model.Osd.Resource = function () {};

/**
 * @type {VDRest.Api.Resource}
 */
VDRest.Osd.Model.Osd.Resource.prototype = new VDRest.Api.Resource();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Osd.Model.Osd.Resource.prototype._class = 'VDRest.Osd.Model.Osd.Resource';

/**
 * url store
 * @type {{channelList: string}}
 */
VDRest.Osd.Model.Osd.Resource.prototype.urls = {

    "main" : "osd.json"
};