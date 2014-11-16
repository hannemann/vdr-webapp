/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Shows.Resource = function () {};

/**
 * @type {VDRest.Abstract.IndexedDB}
 */
VDRest.Database.Model.Shows.Resource.prototype = new VDRest.Abstract.IndexedDB();

/**
 * @type {String}
 */
VDRest.Database.Model.Shows.Resource.prototype.dbName = "recordings";

/**
 * @type {String}
 */
VDRest.Database.Model.Shows.Resource.prototype.onloadevent = "seriesloaded";