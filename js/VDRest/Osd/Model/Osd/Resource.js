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

/**
 * handle osd error
 * in common 404 means no OSD available
 */
VDRest.Osd.Model.Osd.Resource.prototype.onError = function (e) {

    var message;

    if (e.status === 404) {
        message = e.statusText;
    }

    this.dataModel.triggerOsdLoaded({
        "responseJSON": {
            "Error" : {"content":VDRest.app.translate(message)}
        }
    });
};