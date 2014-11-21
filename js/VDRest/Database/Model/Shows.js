/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Shows = function () {};

/**
 * @type {VDRest.Database.Model.Database.Collection}
 */
VDRest.Database.Model.Shows.prototype = new VDRest.Database.Model.Database.Collection();

/**
 * @type {String}
 */
VDRest.Database.Model.Shows.prototype.primaryKey = "series_id";

/**
 * object store name
 * @type {string}
 */
VDRest.Database.Model.Shows.prototype.oStore = 'shows';

/**
 * class of collection items
 * @type {string}
 */
VDRest.Database.Model.Shows.prototype.collectionItemModel = 'Shows.Show';
