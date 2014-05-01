/**
 * Channels resource
 * @constructor
 */
VDRest.Timer.Model.List.Timer.Resource = function () {};

/**
 * @type {VDRest.Api.Resource}
 */
VDRest.Timer.Model.List.Timer.Resource.prototype = new VDRest.Api.Resource();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Timer.Model.List.Timer.Resource.prototype._class = 'VDRest.Timer.Model.List.Timer.Resource';

/**
 * url store
 * @type {{channelList: string}}
 */
VDRest.Timer.Model.List.Timer.Resource.prototype.urls = {

    "delete" : "timers",
    "timerList" : "timers.json"
};