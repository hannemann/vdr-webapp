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
 * name attribute
 * @type {string}
 */
VDRest.Database.Model.Movies.prototype.nameAttribute = 'title';

/**
 * name attribute
 * @type {string}
 */
VDRest.Database.Model.Movies.prototype.genreAttribute = 'genres';

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
