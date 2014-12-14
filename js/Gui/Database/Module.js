/**
 * Remote frontend Module
 * @constructor
 */
Gui.Database = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
Gui.Database.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
Gui.Database.prototype.namespace = 'Gui';

/**
 * Modulename
 * @type {string}
 */
Gui.Database.prototype.name = 'Database';

/**
 * show up in drawer
 * @type {string}
 */
Gui.Database.prototype.inDrawer = true;

/**
 * start page capable
 * @type {string}
 */
Gui.Database.prototype.startPage = true;

/**
 * headline in menu bar
 * @type {string}
 */
Gui.Database.prototype.headline = 'Your Media';

/**
 * context menu definition
 * @type {{}}
 */
Gui.Database.prototype.contextMenu = {

    "sortRecordingDate": {
        "labels": {
            "on": 'Recording Date &#8595;',
            "off": 'Recording Date &#8593;'
        },
        "state": 'on',
        "scope": 'Gui.Database',
        "fn": function () {

            var controller = this.currentList;
            if (controller) {
                if ("on" === this.contextMenu.sortRecordingDate.state) {

                    this.contextMenu.sortRecordingDate.state = "off";
                    controller.sort('sortRecordingDate', false);

                } else {

                    this.contextMenu.sortRecordingDate.state = "on";
                    controller.sort('sortRecordingDate', true);
                }
            }
        },
        "highlight": function (bObj) {
            if (this.currentList) {
                bObj.button.removeClass('disabled');
                if (0 === this.currentList.currentSorting.indexOf('sortRecordingDate')) {
                    bObj.button.addClass('active');
                } else {
                    bObj.button.removeClass('active');
                }
            } else {
                bObj.button.addClass('disabled');
            }
        }
    },
    "sortReleaseDate": {
        "labels": {
            "on": 'Release Date &#8595;',
            "off": 'Release Date &#8593;'
        },
        "state": 'on',
        "scope": 'Gui.Database',
        "fn": function () {

            var controller = this.currentList;
            if (controller) {
                if ("on" === this.contextMenu.sortReleaseDate.state) {

                    this.contextMenu.sortReleaseDate.state = "off";
                    controller.sort('sortReleaseDate', false);

                } else {

                    this.contextMenu.sortReleaseDate.state = "on";
                    controller.sort('sortReleaseDate', true);
                }
            }
        },
        "highlight": function (bObj) {
            if (this.currentList) {
                bObj.button.removeClass('disabled');
                if (0 === this.currentList.currentSorting.indexOf('sortReleaseDate')) {
                    bObj.button.addClass('active');
                } else {
                    bObj.button.removeClass('active');
                }
            } else {
                bObj.button.addClass('disabled');
            }
        }
    },
    "sortAlpha": {
        "labels": {
            "on": 'Title &#8595;',
            "off": 'Title &#8593;'
        },
        "state": 'off',
        "scope": 'Gui.Database',
        "fn": function () {

            var controller = this.currentList;
            if (controller) {
                if ("on" === this.contextMenu.sortAlpha.state) {

                    this.contextMenu.sortAlpha.state = "off";
                    controller.sort('sortAlpha', false);

                } else {

                    this.contextMenu.sortAlpha.state = "on";
                    controller.sort('sortAlpha', true);
                }
            }
        },
        "highlight": function (bObj) {
            if (this.currentList) {
                bObj.button.removeClass('disabled');
                if (0 === this.currentList.currentSorting.indexOf('sortAlpha')) {
                    bObj.button.addClass('active');
                } else {
                    bObj.button.removeClass('active');
                }
            } else {
                bObj.button.addClass('disabled');
            }
        }
    },
    "sortRating": {
        "labels": {
            "on": 'Rating &#8595;',
            "off": 'Rating &#8593;'
        },
        "state": 'on',
        "scope": 'Gui.Database',
        "fn": function () {

            var controller = this.currentList;
            if (controller) {
                if ("on" === this.contextMenu.sortRating.state) {

                    this.contextMenu.sortRating.state = "off";
                    controller.sort('sortRating', false);

                } else {

                    this.contextMenu.sortRating.state = "on";
                    controller.sort('sortRating', true);
                }
            }
        },
        "highlight": function (bObj) {
            if (this.currentList) {
                bObj.button.removeClass('disabled');
                if (0 === this.currentList.currentSorting.indexOf('sortRating')) {
                    bObj.button.addClass('active');
                } else {
                    bObj.button.removeClass('active');
                }
            } else {
                bObj.button.addClass('disabled');
            }
        }
    },
    "sync": {
        "labels": {
            "on": 'Synchronize',
            "off": 'Synchronize'
        },
        "state": "on",
        "scope": 'Gui.Database',
        "fn": function () {
            VDRest.app.getModule('VDRest.Database').getController('Sync').synchronize();
        }
    },
    "generate_movie_fanart": {
        "labels": {
            "on": 'Generate Movie Fanart',
            "off": 'Generate Movie Fanart'
        },
        "state": 'on',
        "scope": 'Gui.Database',
        "fn": function () {
            this.getController('Fanart', 'movies').generate();
        }
    },
    "generate_shows_fanart": {
        "labels": {
            "on": 'Generate TV-Shows Fanart',
            "off": 'Generate TV-Shows Fanart'
        },
        "state": 'on',
        "scope": 'Gui.Database',
        "fn": function () {
            this.getController('Fanart', 'shows').generate();
        }
    }
};

/**
 * dispatch default view
 */
Gui.Database.prototype.dispatch = function () {

    this.backend = VDRest.app.getModule('VDRest.Database');

    this.getController('Default').dispatchView();
};

/**
 * destroy remote
 */
Gui.Database.prototype.destruct = function () {

    this.getController('Default').destructView();
    this.cache.flush();
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Database', true);
