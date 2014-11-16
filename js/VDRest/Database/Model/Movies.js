/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Movies = function () {};

/**
 * @type {VDRest.Database.Model.Media}
 */
VDRest.Database.Model.Movies.prototype = new VDRest.Database.Model.Collection();

/**
 * @type {String}
 */
VDRest.Database.Model.Movies.prototype.primaryKey = "movie_id";

/**
 * @type {String}
 */
VDRest.Database.Model.Movies.prototype.onloadevent = "moviesloaded";

/**
 * object store name
 * @type {string}
 */
VDRest.Database.Model.Movies.prototype.oStore = 'movies';
