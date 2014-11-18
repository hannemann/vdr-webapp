/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Shows = function () {};

/**
 * @type {VDRest.Database.Model.Media}
 */
VDRest.Database.Model.Shows.prototype = new VDRest.Database.Model.Collection();

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
