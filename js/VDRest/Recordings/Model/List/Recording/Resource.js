/**
 * Channels resource
 * @constructor
 */
VDRest.Recordings.Model.List.Recording.Resource = function () {};

/**
 * @type {VDRest.Rest.Api}
 */
VDRest.Recordings.Model.List.Recording.Resource.prototype = new VDRest.Rest.Api();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Recordings.Model.List.Recording.Resource.prototype._class = 'VDRest.Recordings.Model.List.Recording.Resource';

/**
 * url store
 * @type {{channelList: string}}
 */
VDRest.Recordings.Model.List.Recording.Resource.prototype.urls = {

    "delete" : "recordings",
    "recordingList" : "recordings.json"
};