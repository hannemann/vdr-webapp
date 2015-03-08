/**
 * @class
 * @constructor
 * @property {VDRest.Database.Model.Sync.Movies} moviesModel
 * @property {VDRest.Database.Model.Sync.Episodes} episodesModel
 * @property {VDRest.Database.Model.Sync.Shows} showsModel
 */
VDRest.Database.Model.Sync = function () {};

/**
 * @type {VDRest.Lib.Object}
 */
VDRest.Database.Model.Sync.prototype = new VDRest.Lib.Object();

VDRest.Database.Model.Sync.prototype.bypassCache = true;

/**
 * @type {String}
 */
VDRest.Database.Model.Sync.prototype.dbName = VDRest.Database.Model.Database.Resource.prototype.dbName;

/**
 * default db version -> override!
 * @type {number}
 */
VDRest.Database.Model.Sync.prototype.dbVersion = VDRest.Database.Model.Database.Resource.prototype.dbVersion;

/**
 * default db version -> override!
 * @type {number}
 */
VDRest.Database.Model.Sync.prototype.init = function () {

    this.recordings = [];

    this.registry = {
        "callbacks": {}
    };

    this.analytics = {};

    this.previousProgress = 0;

    this.registerCollection('movies')
        .registerCollection('shows')
        .registerCollection('episodes')
    ;
};

/**
 * register sync model
 * @param type
 * @returns {VDRest.Database.Model.Sync}
 */
VDRest.Database.Model.Sync.prototype.registerCollection = function (type) {

    this.registry[type] = this.module.getModel('Sync.' + type.ucfirst());
    this[type + 'Model'] = this.registry[type];

    return this;
};

/**
 * synchronize
 */
VDRest.Database.Model.Sync.prototype.synchronize = function () {

    this.updategui({
        "action": "addStep",
        "header": VDRest.app.translate('Fetching recordings...')
    });

    this.getRecordings();

    this.updategui({
        "action": "addMessage",
        "message": VDRest.app.translate('Found %s recordings to synchronize.', this.recordings.length)
    });

    this.updategui({
        "action": "addStep",
        "header": VDRest.app.translate('Analyze recordings.'),
        "message": VDRest.app.translate("Starting process...")
    });

    this.callMethod('load', this.collectionsLoaded.bind(this));
};

/**
 * handle collections loaded
 */
VDRest.Database.Model.Sync.prototype.collectionsLoaded = function () {

    this.updategui({
        "action": "addStep",
        "header": VDRest.app.translate('Import:')
    });

    this.parseRecordings();

    this.callMethod('toDelete', this.toDelete.bind(this));
};

/**
 * get items to delete
 */
VDRest.Database.Model.Sync.prototype.toDelete = function () {

    this.updategui({
        "action": "addStep",
        "header": VDRest.app.translate('Outdated:')
    });

    this.analytics.delete = VDRest.app.translate(
        "Found %d movies, %d episodes and %d shows to delete.",
        this.moviesModel.countDelete(),
        this.episodesModel.countDelete(),
        this.showsModel.countDelete()
    );

    this.updategui({
        "action": "addStep",
        "header": this.analytics.delete
    });

    this.confirmStart();
};

/**
 * confirm start
 */
VDRest.Database.Model.Sync.prototype.confirmStart = function () {

    $(window).one('window.confirm.confirm', this.start.bind(this));

    $(window).one('window.confirm.cancel', this.cancel.bind(this));

    $.event.trigger({
        "type": "window.request",
        "payload": {
            "type": "Confirm",
            "data": {
                "message": VDRest.app.translate("%s\n%s\nProceed?", this.analytics.delete, this.analytics.import),
                "id": 'confirmsync'
            }
        }
    });
};

/**
 * start sync
 */
VDRest.Database.Model.Sync.prototype.start = function () {

    $(window).off('window.confirm.cancel');

    this.doDelete();
};

/**
 * cancel
 */
VDRest.Database.Model.Sync.prototype.cancel = function () {

    $(window).off('window.confirm.confirm');

    history.back();
};

/**
 * count items to delete
 */
VDRest.Database.Model.Sync.prototype.doDelete = function () {

    this.deleteCount = {
        "movies": this.moviesModel.countDelete(),
        "episodes": this.episodesModel.countDelete(),
        "shows": this.showsModel.countDelete(),
        "all": this.moviesModel.countDelete() + this.episodesModel.countDelete() + this.showsModel.countDelete()
    };

    if (this.deleteCount.all > 0) {

        this.updategui({
            "action": "addStep",
            "header": VDRest.app.translate('Deleting outdated items:'),
            "progressBar": true
        });

        this.deleteMovies();
    } else {
        this.saveMovies();
    }
};

/**
 * delete movies
 */
VDRest.Database.Model.Sync.prototype.deleteMovies = function () {

    var count = this.deleteCount.all;

    if (this.deleteCount.movies > 0) {

        this.moviesModel.doDelete(this.updateProgress.bind(this, count), this.deleteEpisodes.bind(this));
    } else {
        this.deleteEpisodes();
    }
};

/**
 * delete episodes
 */
VDRest.Database.Model.Sync.prototype.deleteEpisodes = function () {

    var count = this.deleteCount.all;

    if (this.deleteCount.movies > 0) {
        this.previousProgress += this.deleteCount.movies;
    }

    if (this.deleteCount.episodes > 0) {

        this.episodesModel.doDelete(this.updateProgress.bind(this, count), this.deleteShows.bind(this));
    } else {
        this.deleteShows();
    }
};

/**
 * delete shows
 */
VDRest.Database.Model.Sync.prototype.deleteShows = function () {

    var count = this.deleteCount.all;

    if (this.deleteCount.episodes > 0) {
        this.previousProgress += this.deleteCount.episodes;
    }

    if (this.deleteCount.shows > 0) {

        this.showsModel.doDelete(this.updateProgress.bind(this, count), this.saveMovies.bind(this));
    } else {
        this.saveMovies();
    }
};

/**
 * save all movies
 */
VDRest.Database.Model.Sync.prototype.saveMovies = function () {

    var count = this.moviesModel.countUpdates();

    this.previousProgress = 0;

    if (count > 0) {
        this.updategui({
            "action": "addStep",
            "header": VDRest.app.translate('Syncing movies:'),
            "progressBar": true
        });

        this.moviesModel.save(this.updateProgress.bind(this, count), this.saveEpisodes.bind(this));
    } else {
        this.saveEpisodes();
    }
};

/**
 * save all episodes
 */
VDRest.Database.Model.Sync.prototype.saveEpisodes = function () {

    var count = this.episodesModel.countUpdates();

    this.previousProgress = 0;

    if (count > 0) {
        this.updategui({
            "action": "addStep",
            "header": VDRest.app.translate('Syncing episodes:'),
            "progressBar": true
        });

        this.episodesModel.save(this.updateProgress.bind(this, count), this.saveShows.bind(this));
    } else {
        this.saveShows();
    }
};

/**
 * persist shows in database
 */
VDRest.Database.Model.Sync.prototype.saveShows = function () {

    var count = this.showsModel.countUpdates();

    this.previousProgress = 0;

    if (count > 0) {
        this.updategui({
            "action": "addStep",
            "header": VDRest.app.translate('Syncing TV-Shows:'),
            "progressBar": true
        });

        this.showsModel.save(this.updateProgress.bind(this, count), this.complete.bind(this));
    } else {
        this.complete();
    }
};

/**
 * cleanup
 */
VDRest.Database.Model.Sync.prototype.complete = function () {

    this.recordings.length = 0;
    this.shows = undefined;
    VDRest.app.getModule('Gui.Menubar').getController('Default').hideThrobber();

    this.updategui({
        "action": "addStep",
        "header": VDRest.app.translate("Complete")
    });

    if ("function" === typeof this.oncomplete) {
        this.oncomplete();
    }
};

/**
 * parse recordings
 */
VDRest.Database.Model.Sync.prototype.parseRecordings = function () {

    this.recordings.forEach(this.parseRecording.bind(this));

    this.analytics.import = VDRest.app.translate(
        "Found %d movies, %d episodes and %d shows to import.",
        this.moviesModel.countUpdates(),
        this.episodesModel.countUpdates(),
        this.showsModel.countUpdates()
    );

    this.updategui({
        "action": "addStep",
        "header": this.analytics.import,
        "message": VDRest.app.translate("Complete")
    });
};

/**
 * parse single recording
 * @param {VDRest.Recordings.Model.List.Recording} recording
 */
VDRest.Database.Model.Sync.prototype.parseRecording = function (recording) {

    var media = recording.getData('additional_media');

    if (media) {

        this.addRecordingDataToMedia(media, recording);

        if (media.series_id) {

            this.episodesModel.addItem(media);
            this.addSeries(media);

        } else if (media.movie_id) {

            this.moviesModel.addItem(media);
        }
    }
};

/**
 * update progress bar
 * @param {Number} count
 * @param {VDRest.Recordings.Model.List.Recording} recording
 * @param {Number} index
 */
VDRest.Database.Model.Sync.prototype.updateProgress = function (count, recording, index) {

    var i = (index + 1 + this.previousProgress),
        progress = count == i ? 100 : (100 / count * i).toPrecision(4),
        message = progress == 100 ? VDRest.app.translate("Complete") : recording.getData('recording_name');

    this.updategui({
        "action": "addMessage",
        "message": message,
        "progress": progress
    });
};

/**
 * add recording data to media
 * @param {Object} media
 * @param {VDRest.Recordings.Model.List.Recording} recording
 * @returns {*}
 */
VDRest.Database.Model.Sync.prototype.addRecordingDataToMedia = function (media, recording) {

    media.recording_date = recording.getData('event_start_time');
    media.recording_title = recording.getData('event_title');
    media.recording_file_name = recording.getData('file_name');
    media.recording_relative_file_name = recording.getData('relative_file_name');
    media.recording_number = recording.getData('number');
    media.recording_name = recording.getData('name');

    return media;
};

/**
 * add show to collection
 * @param {{}} media
 */
VDRest.Database.Model.Sync.prototype.addSeries = function (media) {

    var showsModel = this.registry['shows'],
        show = showsModel.getItem(media.series_id);

    if (!show) {

        show = showsModel.addItem(media);
    }

    delete media.recording_number;
    show.addEpisode(media);
};

/**
 * copy recordings into array
 */
VDRest.Database.Model.Sync.prototype.getRecordings = function () {

    var recordings = VDRest.app.getModule('VDRest.Recordings').cache.store.Model['List.Recording'],
        i;

    for (i in recordings) {
        if (recordings.hasOwnProperty(i)) {
            this.recordings.push(recordings[i]);
        }
    }
};

/**
 * wrap callback with check if all models are ready
 * @param {String} method
 * @param {Function} callback
 */
VDRest.Database.Model.Sync.prototype.callMethod = function (method, callback) {

    var i;

    this.registry.callbacks[method] = function () {
        var n, fireCallback = true;

        for (n in this.registry) {
            if (n !== "callbacks" && this.registry.hasOwnProperty(n) && !this.registry[n].triggeredCallbacks[method]) {
                fireCallback = false;
                break;
            }
        }

        if (fireCallback) {
            callback();
        }
    }.bind(this);

    for (i in this.registry) {
        if (i !== "callbacks" && this.registry.hasOwnProperty(i)) {
            this.registry[i][method](this.registry.callbacks[method]);
        }
    }
};
