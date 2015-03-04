/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Movies = function () {};

/**
 * @type {VDRest.Database.Model.Database.Collection}
 */
VDRest.Database.Model.Movies.prototype = new VDRest.Database.Model.Database.Collection();

/**
 * @type {String}
 */
VDRest.Database.Model.Movies.prototype.primaryKey = "movie_id";

/**
 * object store name
 * @type {string}
 */
VDRest.Database.Model.Movies.prototype.oStore = 'movies';

/**
 * class of collection items
 * @type {string}
 */
VDRest.Database.Model.Movies.prototype.collectionItemModel = 'Movies.Movie';

/**
 * sort alphanumeric
 * @param a
 * @param b
 * @returns {number}
 */
VDRest.Database.Model.Movies.prototype.sortAlpha = function (a, b) {

    a = a.data.title.toLowerCase().replace(/^[^a-z]/, '');
    b = b.data.title.toLowerCase().replace(/^[^a-z]/, '');

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
};

/**
 * sort by release date, newest first
 * @param a
 * @param b
 * @returns {number}
 */
VDRest.Database.Model.Movies.prototype.sortReleaseDate = function (a, b) {

    a.data.release_date.match(/(\d{4}).(\d{2}).(\d{2})/);
    a = new Date(parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10) - 1, parseInt(RegExp.$3, 10)).getTime();

    b.data.release_date.match(/(\d{4}).(\d{2}).(\d{2})/);
    b = new Date(parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10) - 1, parseInt(RegExp.$3, 10)).getTime();

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
};

/**
 * sort by release date, newest first
 * @param a
 * @param b
 * @returns {number}
 */
VDRest.Database.Model.Movies.prototype.sortRecordingDate = function (a, b) {

    a = a.data.recording_date;
    b = b.data.recording_date;

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
};

/**
 * sort by vote average, best first
 * @param a
 * @param b
 * @returns {number}
 */
VDRest.Database.Model.Movies.prototype.sortRating = function (a, b) {

    a = a.data.vote_average;
    b = b.data.vote_average;

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
};

/**
 * search list
 * @param {{}} request          search string
 * @param {Function} callback   callback function
 */
VDRest.Database.Model.Movies.prototype.search = function (request, callback) {

    var attributes = request.attributes.length > 0 ? request.attributes : ['title'],
        genre = request.genre.length > 0 ? request.genre : false, skipItem = false;

    this.searchResult = this.module.getModel('Movies');

    this.each(function (item) {

        if (skipItem) {
            skipItem = false;
        }

        if (genre) {
            if (genre.pfIntersect(this.genresToArray(item)).length <= 0) {
                skipItem = true;
            }
        }

        attributes.forEach(function (attribute) {
            if (!skipItem && item.data[attribute].toLowerCase().indexOf(request.query.toLowerCase()) > -1) {
                this.searchResult.addItem(item.getData());
                skipItem = true;
            }
        }.bind(this));

    }.bind(this), callback);
};

/**
 * convert genres string to array
 * @param {VDRest.Database.Model.Movies} item
 * @returns {String[]}
 */
VDRest.Database.Model.Movies.prototype.genresToArray = function (item) {

    return item.getData('genres').split(',').map(function (genre) {
        return genre.replace(/(^\s*|\s*$)/g, '');
    }.bind(this)).join('|').replace(/\|{2,}/g, '|').replace(/(^\||\|$)/g, '').split('|');
};

/**
 * retrieve genres from movies
 * @returns {Array}
 */
VDRest.Database.Model.Movies.prototype.getGenres = function () {

    var reg;

    if (!this.genres) {
        reg = new RegExp('(^\\s*|\\s*$)', 'g');
        this.genres = [];

        this.each(function (item) {
            item.getData('genres').split(',').map(function (genre) {
                genre = genre.replace(reg, '');
                if ('' !== genre && this.genres.indexOf(genre) < 0) {
                    this.genres.push(genre);
                }
                return genre;
            }.bind(this));
        }.bind(this));
        this.genres.sort();
    }
    return this.genres;
};
