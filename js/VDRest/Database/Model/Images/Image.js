/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Images.Image = function () {};

/**
 * @type {VDRest.Abstract.IndexedDB.Item}
 */
VDRest.Database.Model.Images.Image.prototype = new VDRest.Database.Model.Database.Item();

/**
 * @type {String}
 */
VDRest.Database.Model.Images.Image.prototype.cacheKey = "name";

/**
 * @type {String}
 */
VDRest.Database.Model.Images.Image.prototype.primaryKey = "name";

/**
 * object store name
 * @type {string}
 */
VDRest.Database.Model.Images.Image.prototype.oStore = 'images';

/**
 * collection model name
 * @type {string}
 */
VDRest.Database.Model.Images.Image.prototype.collectionModel = 'Images';
