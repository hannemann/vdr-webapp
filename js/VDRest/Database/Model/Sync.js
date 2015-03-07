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

    this.callback({
        "action": "addStep",
        "header": VDRest.app.translate('Fetching recordings...')
    });

    this.getRecordings();

    this.callback({
        "action": "addMessage",
        "message": VDRest.app.translate('Found %s recordings to synchronize.', this.recordings.length)
    });

    this.callback({
        "action": "addStep",
        "header": VDRest.app.translate('Analyze recordings.'),
        "message": VDRest.app.translate("Starting process..."),
        "addProgress": true
    });

    this.callMethod('load', this.collectionsLoaded.bind(this));
};

/**
 * handle collections loaded
 */
VDRest.Database.Model.Sync.prototype.collectionsLoaded = function () {

    this.parseRecordings();

    this.callMethod('toDelete', this.doDelete.bind(this));
};

/**
 * determine which items to delete
 */
VDRest.Database.Model.Sync.prototype.doDelete = function () {

    this.deleteCount = {
        "movies": this.moviesModel.countdelete(),
        "episodes": this.episodesModel.countdelete(),
        "shows": this.showsModel.countdelete(),
        "all": this.moviesModel.countdelete() + this.episodesModel.countdelete() + this.showsModel.countdelete()
    };
    this.addToIndex = 0;

    if (this.deleteCount.all > 0) {

        this.callback({
            "action": "addStep",
            "header": VDRest.app.translate('Deleting outdated items:'),
            "addProgress": true
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

    this.addToIndex = this.deleteCount.movies;

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

    this.addToIndex = this.deleteCount.movies;

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

    this.addToIndex = 0;

    if (count > 0) {
        this.callback({
            "action": "addStep",
            "header": VDRest.app.translate('Syncing movies:'),
            "addProgress": true
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

    this.addToIndex = 0;

    if (count > 0) {
        this.callback({
            "action": "addStep",
            "header": VDRest.app.translate('Syncing episodes:'),
            "addProgress": true
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

    this.addToIndex = 0;

    if (count > 0) {
        this.callback({
            "action": "addStep",
            "header": VDRest.app.translate('Syncing TV shows'),
            "addProgress": true
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

    this.callback({
        "action": "addStep",
        "header": VDRest.app.translate("Complete")
    });
};

/**
 * parse recordings
 */
VDRest.Database.Model.Sync.prototype.parseRecordings = function () {

    var resultMessage;

    this.recordings.forEach(function (recording, index) {

        var media = recording.getData('additional_media'),
            percentage = this.recordings.length == index ? 100 : (100 / this.recordings.length * index).toPrecision(4);

        if (media) {

            this.callback({
                "action": "addMessage",
                "message": VDRest.app.translate("Analyzing %s", recording.getData('name')),
                "percentage": percentage
            });

            this.addRecordingDataToMedia(media, recording);

            if (media.series_id) {

                this.episodesModel.addItem(media);
                this.addSeries(media);

            } else if (media.movie_id) {

                this.moviesModel.addItem(media);
            }
        }
    }.bind(this));

    this.callback({
        "action": "addMessage",
        "message": VDRest.app.translate("Complete")
    });

    resultMessage = VDRest.app.translate(
        "Found %d movies, %d episodes and %d shows.",
        this.moviesModel.countUpdates(),
        this.episodesModel.countUpdates(),
        this.showsModel.countUpdates()
    );

    this.callback({
        "action": "addStep",
        "header": resultMessage
    });
};

/**
 * update progress bar
 * @param {Number} count
 * @param {VDRest.Recordings.Model.List.Recording} recording
 * @param {Number} index
 */
VDRest.Database.Model.Sync.prototype.updateProgress = function (count, recording, index) {

    var i = (index + 1 + this.addToIndex),
        percentage = count == i ? 100 : (100 / count * i).toPrecision(4),
        message = percentage == 100 ? VDRest.app.translate("Complete") : recording.getData('recording_name');

    this.callback({
        "action": "addMessage",
        "message": message,
        "percentage": percentage
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
