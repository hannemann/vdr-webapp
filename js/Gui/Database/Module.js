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
 * Module depends on vdr plugin scraper2vdr or tvscraper
 * @type {string}
 */
Gui.Database.prototype.pluginDependency = 'scraper2vdr||tvscraper';

/**
 * context menu definition
 * @type {{}}
 */
Gui.Database.prototype.contextMenu = {

    "search": {
        "labels": {
            "on": "Search",
            "off": "Search"
        },
        "state": "on",
        "scope": "Gui.Database",
        "fn": function () {

            var controller = this.currentList;
            if (controller) {
                controller.search();
            }
        },
        "highlight": function (bObj) {
            bObj.button.toggleClass('hidden', !this.currentList || !!this.currentList.activeItem);
        }
    },
    "sortRecordingDate": {
        "labels": {
            "on": 'Recording Date &#8595;',
            "off": 'Recording Date &#8593;'
        },
        "state": 'on',
        "scope": 'Gui.Database',
        "fn": function () {

            if (this.currentList) {
                this.contextMenu.sortRecordingDate.state =
                    "on" === this.contextMenu.sortRecordingDate.state ?
                        "off" : "on";
                this.currentList.sort(
                    'sortRecordingDate',
                    "on" === this.contextMenu.sortRecordingDate.state
                );
            }
        },
        "highlight": function (bObj) {
            bObj.button.toggleClass('hidden', !this.currentList || !!this.currentList.activeItem);
            bObj.button.toggleClass(
                'active',
                !!this.currentList && 0 === this.currentList.currentSorting.indexOf('sortRecordingDate')
            );
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

            if (this.currentList) {
                this.contextMenu.sortReleaseDate.state =
                    "on" === this.contextMenu.sortReleaseDate.state ?
                        "off" : "on";
                this.currentList.sort(
                    'sortReleaseDate',
                    "on" === this.contextMenu.sortReleaseDate.state
                );
            }
        },
        "highlight": function (bObj) {
            bObj.button.toggleClass('hidden', !this.currentList || !!this.currentList.activeItem);
            bObj.button.toggleClass(
                'active',
                !!this.currentList && 0 === this.currentList.currentSorting.indexOf('sortReleaseDate')
            );
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

            if (this.currentList) {
                this.contextMenu.sortAlpha.state =
                    "on" === this.contextMenu.sortAlpha.state ?
                        "off" : "on";
                this.currentList.sort(
                    'sortAlpha',
                    "on" === this.contextMenu.sortAlpha.state
                );
            }
        },
        "highlight": function (bObj) {
            bObj.button.toggleClass('hidden', !this.currentList || !!this.currentList.activeItem);
            bObj.button.toggleClass(
                'active',
                !!this.currentList && 0 === this.currentList.currentSorting.indexOf('sortAlpha')
            );
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

            if (this.currentList) {
                this.contextMenu.sortRating.state =
                    "on" === this.contextMenu.sortRating.state ?
                        "off" : "on";
                this.sortRating.sort(
                    'sortAlpha',
                    "on" === this.contextMenu.sortRating.state
                );
            }
        },
        "highlight": function (bObj) {
            bObj.button.toggleClass('hidden', !this.currentList || !!this.currentList.activeItem);
            bObj.button.toggleClass(
                'active',
                !!this.currentList && 0 === this.currentList.currentSorting.indexOf('sortRating')
            );
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

            this.getController('Sync').dispatchView();
        },
        "highlight": function (bObj) {
            bObj.button.toggleClass('hidden', !!this.currentList || !!this.syncing);
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
        },
        "highlight": function (bObj) {
            bObj.button.toggleClass('hidden', !!this.currentList || !!this.syncing);
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
        },
        "highlight": function (bObj) {
            bObj.button.toggleClass('hidden', !!this.currentList || !!this.syncing);
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
