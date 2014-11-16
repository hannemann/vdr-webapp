/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Shows.Show.Episodes.Episode = function () {};

/**
 * @type {VDRest.Database.Model.Media}
 */
VDRest.Database.Model.Shows.Show.Episodes.Episode.prototype = new VDRest.Database.Model.Media();

/**
 * @type {String}
 */
VDRest.Database.Model.Shows.Show.Episodes.Episode.prototype.cacheKey = "series_id/episode_id";

/**
 * @type {String}
 */
VDRest.Database.Model.Shows.Show.Episodes.Episode.prototype.primaryKey = "episode_id";

/**
 * object store name
 * @type {string}
 */
VDRest.Database.Model.Shows.Show.Episodes.Episode.prototype.oStore = 'episodes';
