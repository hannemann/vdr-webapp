/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Database.Collection = function () {};

/**
 * @type {VDRest.Lib.Object}
 */
VDRest.Database.Model.Database.Collection.prototype = new VDRest.Abstract.IndexedDB.Collection();

/**
 * @type {String}
 */
VDRest.Database.Model.Database.Collection.prototype.dbName = VDRest.Database.Model.Database.Resource.prototype.dbName;

/**
 * default db version -> override!
 * @type {number}
 */
VDRest.Database.Model.Database.Collection.prototype.dbVersion = VDRest.Database.Model.Database.Resource.prototype.dbVersion;