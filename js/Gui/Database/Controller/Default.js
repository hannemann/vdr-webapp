/**
 * @class
 * @constructor
 */
Gui.Database.Controller.Default = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Database.Controller.Default.prototype = new VDRest.Abstract.Controller();

/**
 * initialize view
 */
Gui.Database.Controller.Default.prototype.init = function () {

    this.view = this.module.getView('Default', this.data);

    this.tiles = [];
    this.initSliderCalls = 0;
    this.backendsReady = 0;

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );

    this.shows = this.module.backend.getModel('Shows');
    this.shows.onload = function () {
        this.shows.load(undefined, this.oninitbackends.bind(this));
    }.bind(this);

    this.movies = this.module.backend.getModel('Movies');
    this.movies.onload = function () {
        this.movies.load(undefined, this.oninitbackends.bind(this));
    }.bind(this);
};

Gui.Database.Controller.Default.prototype.oninitbackends = function () {

    this.backendsReady++;

    if (this.backendsReady == 2) {

        this.hasMovies = this.movies.count() > 0;
        this.hasShows = this.shows.count() > 0;

        if (this.hasMovies || this.hasShows) {

            this.initFanarts();
        } else {
            this.backendsReady = 0;
            this.askSync();
        }
    }
};

/**
 * initialize view
 */
Gui.Database.Controller.Default.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    $(document).on('databaseslidertiledispatch', this.initTouchSlider.bind(this));
};

/**
 * initialize fanart
 */
Gui.Database.Controller.Default.prototype.initFanarts = function () {


    if (this.hasMovies) {
        this.tiles.push(this.module.getController('Fanart', {
            "id": "movies",
            "header": "Movies",
            "type": "movies",
            "parent": this
        }));
    }
    if (this.hasShows) {
        this.tiles.push(this.module.getController('Fanart', {
            "id": "shows",
            "header": "TV-Shows",
            "type": "shows",
            "parent": this
        }));
    }

    return this;
};

/**
 * initialize slider
 */
Gui.Database.Controller.Default.prototype.initTouchSlider = function () {

    var wrapper = document.querySelector('#viewport');

    this.initSliderCalls++;

    if (this.initSliderCalls == this.tiles.length) {
        new TouchMove.Slide({
            "wrapper" : wrapper,
            "sliderClassName" : 'fanart-slider',
            "allowedOrientations" : ['landscape']
        });
    }

    return this;
};

/**
 * ask user if we should synchronize recordings
 */
Gui.Database.Controller.Default.prototype.askSync = function () {

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "type" : "Confirm",
            "data" : {
                "message" : "It seems that your database hasn't been synchronized yet. Should we do this now?",
                "id" : 'askSync'
            }
        }
    });

    $(document).one('window.confirm.confirm', $.proxy(function () {
        VDRest.app.getModule('VDRest.Database').getController('Sync').synchronize(function () {
            this.shows.load(undefined, this.oninitbackends.bind(this));
            this.movies.load(undefined, this.oninitbackends.bind(this));
        }.bind(this));
    }, this));
};
