VDRest.Database.Model.Sync = function () {};

VDRest.Database.Model.Sync.prototype = new VDRest.Abstract.IndexedDB();

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
    VDRest.Abstract.IndexedDB.prototype.init.call(this);
};

VDRest.Database.Model.Sync.prototype.synchronize = function () {

    this.current = 0;
    this.getRecordings();
    this.addRecording();
};

VDRest.Database.Model.Sync.prototype.addRecording = function () {

    if (this.current >= this.recordings.length) {
        VDRest.app.getModule('Gui.Menubar').getController('Default').hideThrobber();
        return;
    }

    var recording = this.recordings[this.current],
        media = recording.getData('additional_media')[0],
        episode, movie;

    if (media) {

        if (media.series_id) {

            media.recording_number = recording.getData('number');
            episode = this.module.getModel('Shows.Show.Episodes.Episode', media);
            episode.persist($.proxy(this.addSeries, this, media));

        } else if (media.movie_id) {

            media.recording_number = recording.getData('number');
            movie = this.module.getModel('Movies.Movie', media);
            this.current++;
            movie.persist($.proxy(this.addRecording, this));
        }
    } else {
        this.current++;
        this.addRecording();
    }
};

VDRest.Database.Model.Sync.prototype.addSeries = function (media) {

    var show;

    delete media.recording_number;

    media = VDRest.Database.Model.Shows.Show.prototype.initMedia(media);
    show = this.module.getModel('Shows.Show', media);
    show.addEpisode(media);
    this.current++;

    show.persist($.proxy(this.addRecording, this));
};

VDRest.Database.Model.Sync.prototype.getRecordings = function () {

    var recordings = VDRest.app.getModule('VDRest.Recordings').cache.store.Model['List.Recording'],
        i;

    for (i in recordings) {
        if (recordings.hasOwnProperty(i)) {
            this.recordings.push(recordings[i]);
        }
    }
};
