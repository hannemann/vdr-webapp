/**
 * @constructor
 * @property {VDRest.Database.Model.Movies} collection
 * @property {VDRest.Database.Model.Movies} updateCollection
 * @property {String} type
 * @property {String} primaryKey
 * @property {{}} updateItems
 * @property {[]} deleteItems
 * @property {{}} triggeredCallbacks
 */
VDRest.Database.Model.Sync.Movies = function () {
};

/**
 * @type {VDRest.Database.Model.Sync.Abstract}
 */
VDRest.Database.Model.Sync.Movies.prototype = new VDRest.Database.Model.Sync.Abstract();
