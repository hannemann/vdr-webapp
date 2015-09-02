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
 * retrieve url encoded path
 * @param {VDRest.Recordings.Model.List.Recording} recording
 * @return {string}
 */
VDRest.Recordings.Model.List.Recording.Resource.prototype.getFileNameUrlEncoded = function (recording) {

    var parts = recording.data.file_name.split('/');

    parts.forEach(function (part, index) {
        parts[index] = encodeURIComponent(part);
    });

    return parts.join('/');
};

/**
 * delete recording
 * @param {VDRest.Recordings.Model.List.Recording} recording
 * @param {function} [callback]
 */
VDRest.Recordings.Model.List.Recording.Resource.prototype.deleteRecording = function (recording, callback) {

    var message = recording.getData('event_ttle'), request = {};

    message += recording.getData('event_short_text') ? ' - ' + recording.getData('event_short_text') : '';

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "type" : "Confirm",
            "data" : {
                "message": VDRest.app.translate("Delete Recording") + " '" + message + "'?",
                "id" : 'delete.recording' + recording.getData('mumber')
            }
        }
    });

    $document.one('window.confirm.confirm', function () {

        request.url = this.getBaseUrl() + 'recordings' + this.getFileNameUrlEncoded(recording);
        request.method = 'DELETE';

        this.fetchAsync(request, function (response) {

            $.event.trigger({
                "type": "vdrest-api-actions.recording-deleted." + recording.eventKey,
                "payload" : {
                    data : response
                }
            });

            if ("function" === typeof callback) {

                callback(response);
            }
        });

    }.bind(this));

};

/**
 * move/rename recording
 * @param obj
 * @param callback
 */
VDRest.Recordings.Model.List.Recording.Resource.prototype.moveRecording = function (obj, callback) {

    var request = {};

    request.url = this.getBaseUrl() + 'recordings/move.json';
    request.method = 'POST';
    request.data = {
        "source" : obj.source,
        "target" : obj.target
    };

    this.fetchAsync(request, function (response) {

        $.event.trigger({
            "type": "vdrest-api-actions.recording-updated." + obj.eventSuffix,
            "payload" : {
                data : response
            }
        });

        if ("function" === typeof callback) {

            callback(response);
        }
    });
};

/**
 * fetch cutting marks of specific recording
 * @param recording
 */
VDRest.Recordings.Model.List.Recording.Resource.prototype.getCuttingMarks = function (recording) {

    var request = {
        "url": this.getBaseUrl() + 'recordings' + this.getFileNameUrlEncoded(recording) + '.json?marks=true',
        "method": "GET"
    };

    this.fetchAsync(request, function (response) {

        if (response.count > 0 && recording.data.file_name === response.recordings[0].file_name) {

            $.event.trigger({
                "type": "vdrest-api-actions.recording-marks-loaded" + recording.eventKey,
                "payload": {
                    "data": response
                }
            });
        } else {

            $.event.trigger({
                "type": "vdrest-api-actions.load-recording-marks-failed" + recording.eventKey,
                "payload": {
                    "data": response
                }
            });
            this.onError({
                "readyState": 4,
                "status": "custom",
                "statusText": "The requested recording does not match the servers response. Please update your recordings"
            });
        }
    }.bind(this));
};

/**
 * save cutting marks of specific recording
 * @param recording
 */
VDRest.Recordings.Model.List.Recording.Resource.prototype.saveCuttingMarks = function (recording) {

    var request = {
        "url": this.getBaseUrl() + 'recordings/marks' + this.getFileNameUrlEncoded(recording),
        "method": "POST",
        "data": {
            "marks": recording.data.marks
        }
    };

    this.fetchAsync(request, function (response) {

        $.event.trigger({
            "type": "vdrest-api-actions.recording-marks-saved" + recording.eventKey,
            "payload": {
                "data": response
            }
        });
    }.bind(this));
};

/**
 * delete cutting marks of specific recording
 * @param recording
 */
VDRest.Recordings.Model.List.Recording.Resource.prototype.deleteCuttingMarks = function (recording) {

    var request = {
        "url": this.getBaseUrl() + 'recordings/marks' + this.getFileNameUrlEncoded(recording),
        "method": "DELETE"
    };

    this.fetchAsync(request, function (response) {

        $.event.trigger({
            "type": "vdrest-api-actions.recording-marks-deleted" + recording.eventKey,
            "payload": {
                "data": response
            }
        });
    }.bind(this));
};

/**
 * cut a specific recording
 * @param recording
 */
VDRest.Recordings.Model.List.Recording.Resource.prototype.cutRecording = function (recording) {

    var request = {
        "url": this.getBaseUrl() + 'recordings/cut' + this.getFileNameUrlEncoded(recording),
        "method": "POST"
    };

    $window.one('vdrest-api-actions.cutter-status', function () {

        if (!this.cutterActive) {
            this.fetchAsync(request, function (response, xhr) {

                if (200 === xhr.status) {

                    this.cutterActive = true;
                    $.event.trigger({
                        "type": "vdrest-api-actions.cutter-started." + recording.eventKey
                    });

                    this.cutterStatusInterval = setInterval(function () {

                        if (!this.cutterActive) {

                            clearInterval(this.cutterStatusInterval);
                            $.event.trigger({
                                "type": "vdrest-api-actions.recording-cut." + recording.eventKey
                            });
                        } else {
                            this.getCutterStatus();
                        }
                    }.bind(this), 3000);

                } else {

                    $.event.trigger({
                        "type": "vdrest-api-actions.cutter-start-failed." + recording.eventKey
                    });
                }
            }.bind(this));
        } else {
            $.event.trigger({
                "type": "vdrest-api-actions.cutter-active"
            });
        }
    }.bind(this));

    this.getCutterStatus();
};
/**
 * get cutter status
 */
VDRest.Recordings.Model.List.Recording.Resource.prototype.getCutterStatus = function () {

    var request = {
        "url": this.getBaseUrl() + 'recordings/cut.json',
        "method": "GET"
    };

    this.fetchAsync(request, function (response) {

        this.cutterActive = response.active;
        $.event.trigger({
            "type": "vdrest-api-actions.cutter-status"
        });
        if (this.cutterActive) {
            $.event.trigger({
                "type": "vdrest-api-actions.cutter-active"
            });
        } else {
            $.event.trigger({
                "type": "vdrest-api-actions.cutter-inactive"
            });
        }
    }.bind(this));
};
/**
 * get edited file status
 */
VDRest.Recordings.Model.List.Recording.Resource.prototype.getEditedFile = function (recording) {

    var request = {
        "url": this.getBaseUrl() + 'recordings/editedfile' + this.getFileNameUrlEncoded(recording) + '.json',
        "method": "GET"
    };

    this.fetchAsync(request, function (response) {
        $.event.trigger({
            "type": "vdrest-api-actions.edited-file-loaded." + recording.eventKey,
            "payload" : {
                "data" : response
            }
        });
    }.bind(this));
};
