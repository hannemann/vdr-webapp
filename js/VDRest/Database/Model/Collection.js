/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Collection = function () {};

/**
 * @type {VDRest.Lib.Object}
 */
VDRest.Database.Model.Collection.prototype = new VDRest.Abstract.IndexedDB.Collection();

/**
 * @type {String}
 */
VDRest.Database.Model.Collection.prototype.dbName = VDRest.Database.Model.Database.Resource.prototype.dbName;

/**
 * default db version -> override!
 * @type {number}
 */
VDRest.Database.Model.Collection.prototype.dbVersion = VDRest.Database.Model.Database.Resource.prototype.dbVersion;