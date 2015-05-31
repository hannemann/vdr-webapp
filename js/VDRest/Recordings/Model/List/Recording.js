/**
 * Channels resource
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

    $document.on('vdrest-api-actions.recording-updated.' + this.keyInCache.toCacheKey(), this.update.bind(this));
};

/**
 * process update event
 * @param {jQuery.Event} e
 */
VDRest.Recordings.Model.List.Recording.prototype.update = function (e) {

    var i;

    for (i in e.payload.data.recordings[0]) {

        if (e.payload.data.recordings[0].hasOwnProperty(i)) {

            this.data[i] = e.payload.data.recordings[0][i];
        }
    }
    $.event.trigger({
        "type": "gui-recording.updated." + this.keyInCache.toCacheKey()
    });
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
