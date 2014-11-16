/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Movies.Movie = function () {};

/**
 * @type {VDRest.Database.Model.Media}
 */
VDRest.Database.Model.Movies.Movie.prototype = new VDRest.Database.Model.Media();

/**
 * @type {String}
 */
VDRest.Database.Model.Movies.Movie.prototype.cacheKey = "movie_id";

/**
 * @type {String}
 */
VDRest.Database.Model.Movies.Movie.prototype.primaryKey = "movie_id";

/**
 * object store name
 * @type {string}
 */
VDRest.Database.Model.Movies.Movie.prototype.oStore = 'movies';
