/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Recordings.Recording = function () {
};

/**
 * @type {VDRest.Abstract.IndexedDB.Item}
 */
VDRest.Database.Model.Recordings.Recording.prototype = new VDRest.Database.Model.Database.Item();

/**
 * @type {String}
 */
VDRest.Database.Model.Recordings.Recording.prototype.cacheKey = "file_name";

/**
 * @type {String}
 */
VDRest.Database.Model.Recordings.Recording.prototype.primaryKey = "file_name";

/**
 * object store name
 * @type {string}
 */
VDRest.Database.Model.Recordings.Recording.prototype.oStore = 'recordings';

/**
 * collection model name
 * @type {string}
 */
VDRest.Database.Model.Recordings.Recording.prototype.collectionModel = 'Recordings';
