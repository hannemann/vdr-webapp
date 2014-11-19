/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Shows.Show.Episodes.Episode = function () {};

/**
 * @type {VDRest.Abstract.IndexedDB.Item}
 */
VDRest.Database.Model.Shows.Show.Episodes.Episode.prototype = new VDRest.Abstract.IndexedDB.Item();

/**
 * @type {String}
 */
VDRest.Database.Model.Shows.Show.Episodes.Episode.prototype.cacheKey = "episode_id";

/**
 * @type {String}
 */
VDRest.Database.Model.Shows.Show.Episodes.Episode.prototype.primaryKey = "episode_id";

/**
 * object store name
 * @type {string}
 */
VDRest.Database.Model.Shows.Show.Episodes.Episode.prototype.oStore = 'episodes';
