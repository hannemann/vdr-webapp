/**
 * @constructor
 * @property {VDRest.Database.Model.Episodes} collection
 * @property {VDRest.Database.Model.Episodes} updateCollection
 * @property {String} type
 * @property {String} primaryKey
 * @property {{}} updateItems
 * @property {[]} deleteItems
 * @property {{}} triggeredCallbacks
 */
VDRest.Database.Model.Sync.Episodes = function () {
};

/**
 * @type {VDRest.Database.Model.Sync.Abstract}
 */
VDRest.Database.Model.Sync.Episodes.prototype = new VDRest.Database.Model.Sync.Abstract();

/**
 * @type {string}
 */
VDRest.Database.Model.Sync.Episodes.prototype.collectionItemModel = 'Shows.Show.Episodes';
