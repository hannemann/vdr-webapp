/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Movies.Movie = function () {};

/**
 * @type {VDRest.Abstract.IndexedDB.Item}
 */
VDRest.Database.Model.Movies.Movie.prototype = new VDRest.Database.Model.Database.Item();

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

/**
 * collection model name
 * @type {string}
 */
VDRest.Database.Model.Movies.Movie.prototype.collectionModel = 'Movies';

/**
 * retrieve image
 * @param {String} type fanart, poster etc.
 * @returns {String|Boolean}
 */
VDRest.Database.Model.Movies.Movie.prototype.getImage = function (type) {

    if (this.data[type] && this.data[type] != '') {
        return this.data[type]
    }

    return false;
};

/**
 * retrieve rating
 * @param {Number} [precision]
 * @returns {String|Boolean}
 */
VDRest.Database.Model.Movies.Movie.prototype.getRating = function (precision) {

    precision = precision || 2;

    if (this.data.vote_average && this.data.vote_average != '') {
        return this.data.vote_average.toPrecision(precision)
    }

    return false;
};
