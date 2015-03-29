/**
 * @class
 * @constructor
 */
VDRest.Recordings.Model.List.Recording.DBCollection = function () {
};

/**
 * @type {VDRest.Database.Model.Database.Collection}
 */
VDRest.Recordings.Model.List.Recording.DBCollection.prototype = new VDRest.Database.Model.Database.Collection();

/**
 * @type {String}
 */
VDRest.Recordings.Model.List.Recording.DBCollection.prototype.primaryKey = "file_name";

/**
 * object store name
 * @type {string}
 */
VDRest.Recordings.Model.List.Recording.DBCollection.prototype.oStore = 'recordings';

/**
 * class of collection items
 * @type {string}
 */
VDRest.Recordings.Model.List.Recording.DBCollection.prototype.collectionItemModel = 'List.Recording';
