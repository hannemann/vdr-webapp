/**
 * Channels resource
 * @constructor
 */
VDRest.Recordings.Model.List.Recording.Resource = function () {};

/**
 * @type {VDRest.Api.Resource}
 */
VDRest.Recordings.Model.List.Recording.Resource.prototype = new VDRest.Api.Resource();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Recordings.Model.List.Recording.Resource.prototype._class = 'VDRest.Recordings.Model.List.Recording.Resource';

/**
 * @type {boolean}
 */
VDRest.Recordings.Model.List.Recording.Resource.prototype.noThrobber = true;

/**
 * url store
 * @type {{channelList: string}}
 */
VDRest.Recordings.Model.List.Recording.Resource.prototype.urls = {

    "delete" : "recordings",
    "recordingList" : "recordings.json"
};

/**
 * delete recording
 * @param obj
 * @param callback
 */
VDRest.Recordings.Model.List.Recording.Resource.prototype.deleteRecording = function (obj, callback) {

    var message = obj.getEventTitle(), request = {};

    message += obj.hasEventShortText() ? ' - ' + obj.getEventShortText() : '';

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "type" : "Confirm",
            "data" : {
                "message" : "Delete Recording '" + message + "'?",
                "id" : 'delete.recording' + obj.getNumber()
            }
        }
    });

    $(document).one('window.confirm.confirm', $.proxy(function () {

        request.url = this.getBaseUrl() + 'recordings/' + obj.getNumber();
        request.method = 'DELETE';

        this.fetchAsync(request, callback);

    }, this));

};

/**
 * move/rename recording
 * @param obj
 * @param callback
 */
VDRest.Recordings.Model.List.Recording.Resource.prototype.moveRecording = function (obj, callback) {

    var request = {};

    request.url = this.getBaseUrl()
        + 'recordings/move?source='
        + encodeURIComponent(obj.source.replace(/\s/g, '_'))
        + '&target='
        + encodeURIComponent(obj.target);
    request.method = 'POST';

    this.fetchAsync(request, function () {

        $.event.trigger({
            "type" : "vdrest-api-actions.recording-updated." + obj.number
        });

        if ("function" === typeof callback) {

            callback();
        }
    });
};