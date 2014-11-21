/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Images.Image = function () {};

/**
 * @type {VDRest.Abstract.IndexedDB.Item}
 */
VDRest.Database.Model.Images.Image.prototype = new VDRest.Database.Model.Item();

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
