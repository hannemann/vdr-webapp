/**
 * @constructor
 * @property {VDRest.Database.Model.Shows} collection
 * @property {VDRest.Database.Model.Shows} updateCollection
 * @property {String} type
 * @property {String} primaryKey
 * @property {{}} updateItems
 * @property {[]} deleteItems
 * @property {{}} triggeredCallbacks
 */
VDRest.Database.Model.Sync.Shows = function () {
};

/**
 * @type {VDRest.Database.Model.Sync.Abstract}
 */
VDRest.Database.Model.Sync.Shows.prototype = new VDRest.Database.Model.Sync.Abstract();
