/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Recordings = function () {
};

/**
 * @type {VDRest.Database.Model.Database.Collection}
 */
VDRest.Database.Model.Recordings.prototype = new VDRest.Database.Model.Database.Collection();

/**
 * @type {String}
 */
VDRest.Database.Model.Recordings.prototype.primaryKey = "file_name";

/**
 * object store name
 * @type {string}
 */
VDRest.Database.Model.Recordings.prototype.oStore = 'recordings';

/**
 * class of collection items
 * @type {string}
 */
VDRest.Database.Model.Recordings.prototype.collectionItemModel = 'Recordings.Recording';
