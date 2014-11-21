/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Images = function () {};

/**
 * @type {VDRest.Database.Model.Collection}
 */
VDRest.Database.Model.Images.prototype = new VDRest.Database.Model.Collection();

/**
 * @type {String}
 */
VDRest.Database.Model.Images.prototype.primaryKey = "name";

/**
 * object store name
 * @type {string}
 */
VDRest.Database.Model.Images.prototype.oStore = 'images';

/**
 * class of collection items
 * @type {string}
 */
VDRest.Database.Model.Images.prototype.collectionItemModel = 'Images.Image';