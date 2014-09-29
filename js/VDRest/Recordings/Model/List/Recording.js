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
VDRest.Recordings.Model.List.Recording.prototype.cacheKey = 'number';

/**
 * initialize update event
 */
VDRest.Recordings.Model.List.Recording.prototype.init = function () {

    $(document).on('vdrest-api-actions.recording-updated.' + this.data.number, $.proxy(this.update, this));
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

};

/**
 * retrieve stream url
 * @param {Array} [streamdevParams]
 * @returns {string}
 */
VDRest.Recordings.Model.List.Recording.prototype.getStreamUrl = function (streamdevParams) {

    return this.helper().getBaseStreamUrl(streamdevParams)
        + parseInt(parseInt(this.getData('number'), 10) + 1, 10).toString()
        + '.rec.ts';
};
