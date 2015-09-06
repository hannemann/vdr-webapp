/**
 * @typedef {{}} recordingData
 * @property {number} number
 * @property {string} name
 * @property {string} file_name
 * @property {string} relative_file_name
 * @property {string} inode
 * @property {boolean} is_new
 * @property {boolean} is_edited
 * @property {boolean} is_pes_recording
 * @property {number} duration
 * @property {number} filesize_mb
 * @property {string} channel_id
 * @property {number} frames_per_second
 * @property {Array.<string>} marks
 * @property {string} event_title
 * @property {string} event_short_text
 * @property {string} event_description
 * @property {number} event_start_time
 * @property {number} event_duration
 * @property {additionalMediaMovie|additionalMediaEpisode} additional_media
 * @property {string} sync_action
 */

/**
 * recordings data model
 * @property {recordingData} data
 * @property {function} getData
 * @constructor
 */
VDRest.Recordings.Model.List.Recording = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Recordings.Model.List.Recording.prototype = new VDRest.Abstract.Model();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Recordings.Model.List.Recording.prototype._class = 'VDRest.Recordings.Model.List.Recording';

/**
 * @type {string}
 */
VDRest.Recordings.Model.List.Recording.prototype.cacheKey = 'file_name';

/**
 * initialize update event
 */
VDRest.Recordings.Model.List.Recording.prototype.init = function () {

    this.addObserver();
};

/**
 * add event listener
 */
VDRest.Recordings.Model.List.Recording.prototype.addObserver = function () {

    this.eventKey = this.keyInCache.toCacheKey();

    $document.one('vdrest-api-actions.recording-updated.' + this.eventKey, this.update.bind(this));
    $document.one('vdrest-api-actions.recording-deleted.' + this.eventKey, this.deleted.bind(this));
};

/**
 * remove event listener
 */
VDRest.Recordings.Model.List.Recording.prototype.removeObserver = function () {

    $document.off('vdrest-api-actions.recording-updated.' + this.eventKey);
    $document.off('vdrest-api-actions.recording-deleted.' + this.eventKey);
};

/**
 * process update event
 * @param {jQuery.Event} e
 * @param {{}} e.payload
 * @param {{}} e.payload.data
 * @param {recordingData[]} e.payload.data.recordings
 */
VDRest.Recordings.Model.List.Recording.prototype.update = function (e) {

    var i;
    this.removeObserver();

    for (i in e.payload.data.recordings[0]) {

        if (e.payload.data.recordings[0].hasOwnProperty(i)) {

            this.data[i] = e.payload.data.recordings[0][i];
        }
    }
    this.sortCuttingMarks();
    $.event.trigger({
        "type": "gui-recording.updated." + this.eventKey
    });
    this.module.cache.updateKeys(this,this.data[this.cacheKey]);
    this.addObserver();
};

/**
 * delete recording
 * @param {function} callback
 */
VDRest.Recordings.Model.List.Recording.prototype.delete = function (callback) {

    this.deletedCallback = callback;
    this.module.getResource('List.Recording').deleteRecording(this);
};

/**
 * after delete recording
 */
VDRest.Recordings.Model.List.Recording.prototype.deleted = function () {

    this.removeObserver();
    this.module.getModel('List').deleteFromCollection(this);
    this.module.cache.invalidateAllTypes(this);
    if ("function" === typeof this.deletedCallback) {
        this.deletedCallback();
    }
};

/**
 * retrieve stream url
 * @param {Array} [streamdevParams]
 * @returns {string}
 */
VDRest.Recordings.Model.List.Recording.prototype.getStreamUrl = function (streamdevParams) {

    var recordingId;

    if (this.hasData('inode')) {
        recordingId = this.getData('inode');
    } else {
        recordingId = parseInt(parseInt(this.getData('number'), 10) + 1, 10).toString();
    }

    return this.helper().getBaseStreamUrl(streamdevParams)
        + recordingId
        + '.rec.ts';
};

/**
 * retrieve cutting marks
 */
VDRest.Recordings.Model.List.Recording.prototype.getCuttingMarks = function () {

    this.module.getResource('List.Recording').getCuttingMarks(this);

    $window.one("vdrest-api-actions.recording-marks-loaded" + this.eventKey, this.update.bind(this))
};

/**
 * delete cutting marks
 */
VDRest.Recordings.Model.List.Recording.prototype.deleteCuttingMarks = function () {

    this.module.getResource('List.Recording').deleteCuttingMarks(this);

    $window.one("vdrest-api-actions.recording-marks-deleted" + this.eventKey, function () {
        this.data.marks = [];
        $.event.trigger({
            "type": "gui-recording.cutting-marks-deleted." + this.eventKey
        });
    }.bind(this))
};

/**
 * save cutting marks
 */
VDRest.Recordings.Model.List.Recording.prototype.saveCuttingMarks = function () {

    if (this.validateCuttingMarks()) {

        this.sortCuttingMarks();

        $window.one("vdrest-api-actions.recording-marks-saved" + this.eventKey, function () {
            $.event.trigger({
                "type": "gui-recording.cutting-marks-saved." + this.eventKey
            });
        }.bind(this));

        this.module.getResource('List.Recording').saveCuttingMarks(this);
    } else {
        $.event.trigger({
            "type": "gui-recording.cutting-marks-invalid." + this.eventKey
        });
    }
};

/**
 * validate cutting marks
 * @return {boolean}
 */
VDRest.Recordings.Model.List.Recording.prototype.validateCuttingMarks = function () {

    var valid = true, reg = /[0-9]{1,2}:[0-9]{2}:[0-9]{2}(\.[0-9]{2})?/;

    if (!this.data.marks instanceof Array) {
        return false;
    }

    this.data.marks.forEach(function (mark) {
        if (!reg.test(mark)) {
            valid = false;
        }
    });
    return valid;
};

/**
 * sort cutting marks
 * @return VDRest.Recordings.Model.List.Recording
 */
VDRest.Recordings.Model.List.Recording.prototype.sortCuttingMarks = function () {

    this.data.marks.sort(function (a, b) {
        a = parseInt(a.replace(/[^0-9]/g, ''));
        b = parseInt(b.replace(/[^0-9]/g, ''));

        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });

    return this;
};

/**
 * cut recording
 */
VDRest.Recordings.Model.List.Recording.prototype.cut = function () {

    if (this.validateCuttingMarks()) {

        this.sortCuttingMarks();

        this.module.getResource('List.Recording').cutRecording(this);

        $window.one("vdrest-api-actions.recording-cut." + this.eventKey, function () {

            setTimeout(this.getEditedFile.bind(this), 1000);

            $.event.trigger({
                "type": "gui-recording.cut." + this.eventKey
            });

        }.bind(this));

        $window.one("vdrest-api-actions.cutter-start-failed." + this.eventKey, function () {

            $.event.trigger({
                "type": "gui-recording.cutter-start-failed." + this.eventKey
            });

        }.bind(this));
    }
};

/**
 * retrieve edited file
 */
VDRest.Recordings.Model.List.Recording.prototype.getEditedFile = function () {

    $window.one("vdrest-api-actions.edited-file-loaded." + this.eventKey, function (e) {

        this.module.getModel('List').collection.push(
            this.module.getModel('List.Recording', e.payload.data.recordings[0])
        );

        $.event.trigger({
            "type": "gui-recording.edited-file-loaded"
        });

    }.bind(this));

    this.module.getResource('List.Recording').getEditedFile(this);
};

/**
 * determine if timer was created by search timer with given id
 * @param {number} id
 * @return {boolean}
 */
VDRest.Recordings.Model.List.Recording.prototype.getRecordedBySearchTimer = function (id) {

    var p = new DOMParser(),
        x = p.parseFromString(this.data.aux, "text/xml"),
        node = x.getElementsByTagName('s-id')[0],
        textNode,
        sId = false;

    if (node) {
        textNode = node.childNodes[0];
        if (textNode) {
            sId = parseInt(textNode.nodeValue, 10)
        }
    }

    return sId === id;
};
