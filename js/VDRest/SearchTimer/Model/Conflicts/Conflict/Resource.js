/**
 * Channels resource
 * @constructor
 */
VDRest.SearchTimer.Model.Conflicts.Conflict.Resource = function () {
};

/**
 * @type {VDRest.Api.Resource}
 */
VDRest.SearchTimer.Model.Conflicts.Conflict.Resource.prototype = new VDRest.Api.Resource();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.SearchTimer.Model.Conflicts.Conflict.Resource.prototype._class = 'VDRest.SearchTimer.Model.Conflicts.Conflict.Resource';

/**
 * url store
 * @type {Object.<String>}
 */
VDRest.SearchTimer.Model.Conflicts.Conflict.Resource.prototype.urls = {

    "timerconflicts": "searchtimers/conflicts.json"
};
