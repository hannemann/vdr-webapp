/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Shows.Show.Episodes = function () {};

/**
 * @type {VDRest.Abstract.IndexedDB.Collection}
 */
VDRest.Database.Model.Shows.Show.Episodes.prototype = new VDRest.Database.Model.Collection();

/**
 * @type {String}
 */
VDRest.Database.Model.Shows.Show.Episodes.prototype.primaryKey = "episode_id";

/**
 * @type {String}
 */
VDRest.Database.Model.Shows.Show.Episodes.prototype.onloadevent = "episodesloaded";

/**
 * object store name
 * @type {string}
 */
VDRest.Database.Model.Shows.Show.Episodes.prototype.oStore = 'episodes';

