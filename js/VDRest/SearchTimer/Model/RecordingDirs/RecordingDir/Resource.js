/**
 * Channels resource
 * @constructor
 */
VDRest.SearchTimer.Model.RecordingDirs.RecordingDir.Resource = function () {
};

/**
 * @type {VDRest.Api.Resource}
 */
VDRest.SearchTimer.Model.RecordingDirs.RecordingDir.Resource.prototype = new VDRest.Api.Resource();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.SearchTimer.Model.RecordingDirs.RecordingDir.Resource.prototype._class = 'VDRest.SearchTimer.Model.RecordingDirs.RecordingDir.Resource';

/**
 * url store
 * @type {Object.<String>}
 */
VDRest.SearchTimer.Model.RecordingDirs.RecordingDir.Resource.prototype.urls = {

    "recordingdirs": "searchtimers/recordingdirs.json"
};
