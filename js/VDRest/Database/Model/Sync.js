VDRest.Database.Model.Sync = function () {};

/**
 * @type {VDRest.Lib.Object}
 */
VDRest.Database.Model.Sync.prototype = new VDRest.Lib.Object();

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
};

/**
 * synchronize
 */
VDRest.Database.Model.Sync.prototype.synchronize = function () {

    this.current = 0;
    this.getRecordings();
    this.unlink();
    this.addRecording();
};

/**
 * add recording to database
 */
VDRest.Database.Model.Sync.prototype.addRecording = function () {

    if (this.current >= this.recordings.length) {
        VDRest.app.getModule('Gui.Menubar').getController('Default').hideThrobber();
        this.recordings.length = 0;
        return;
    }

    var recording = this.recordings[this.current],
        media = recording.getData('additional_media')[0],
        episode, movie;

    if (media) {

        if (media.series_id) {

            media.recording_number = recording.getData('number');
            episode = this.module.getModel('Shows.Show.Episodes.Episode', media);
            episode.save(this.addSeries.bind(this, media));

        } else if (media.movie_id) {

            media.recording_number = recording.getData('number');
            movie = this.module.getModel('Movies.Movie', media);
            this.current++;
            movie.save(this.addRecording.bind(this));
        }
    } else {
        this.current++;
        this.addRecording();
    }
};

/**
 * add show to database
 * @param {Object} media
 */
VDRest.Database.Model.Sync.prototype.addSeries = function (media) {

    var show;

    delete media.recording_number;

    media = VDRest.Database.Model.Shows.Show.prototype.initMedia(media);
    show = this.module.getModel('Shows.Show', media);
    show.addEpisode(media);
    this.current++;

    show.save(this.addRecording.bind(this));
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
 * delete database items
 */
VDRest.Database.Model.Sync.prototype.unlink = function () {

    ['Shows', 'Shows.Show.Episodes', 'Movies'].forEach(function (store) {
        VDRest.app.getModule('VDRest.Database').getModel(store).each(function (e) {
            e.unlink();
        });
    });
};
