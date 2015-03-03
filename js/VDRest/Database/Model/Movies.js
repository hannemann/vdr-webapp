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
 * @param {String} token        search string
 * @param {Function} callback   callback function
 * @param {Array} attributes    attributes to search in
 */
VDRest.Database.Model.Movies.prototype.search = function (token, callback, attributes) {

    this.searchResult = [];

    attributes = attributes || ['title'];

    this.each(function (item) {

        attributes.forEach(function (attribute) {
            if (item.data[attribute].toLowerCase().indexOf(token.toLowerCase()) > -1) {
                this.searchResult.push(item.id);
            }
        }.bind(this));
    }.bind(this), callback);
};
