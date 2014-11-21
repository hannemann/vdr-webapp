/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Item = function () {};

/**
 * @type {VDRest.Lib.Object}
 */
VDRest.Database.Model.Item.prototype = new VDRest.Abstract.IndexedDB.Item();

/**
 * @type {String}
 */
VDRest.Database.Model.Item.prototype.dbName = VDRest.Database.Model.Database.Resource.prototype.dbName;

/**
 * default db version -> override!
 * @type {number}
 */
VDRest.Database.Model.Item.prototype.dbVersion = VDRest.Database.Model.Database.Resource.prototype.dbVersion;