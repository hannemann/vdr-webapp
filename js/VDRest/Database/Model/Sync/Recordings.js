/**
 * @constructor
 * @property {VDRest.Database.Model.Recordings} collection
 * @property {VDRest.Database.Model.Recordings} updatesCollection
 * @property {VDRest.Database.Model.Recordings} tempCollection
 * @property {String} type
 * @property {String} primaryKey
 * @property {{}} updateItems
 * @property {[]} deleteItems
 * @property {{}} triggeredCallbacks
 */
VDRest.Database.Model.Sync.Recordings = function () {
};

/**
 * @type {VDRest.Database.Model.Sync.Abstract}
 */
VDRest.Database.Model.Sync.Recordings.prototype = new VDRest.Database.Model.Sync.Abstract();

/**
 * @param {VDRest.Recordings.Model.List.Recording} recording
 * @returns {*}
 */
VDRest.Database.Model.Sync.Recordings.prototype.addItem = function (recording) {

    var item, testNew, testOld, numberReg = new RegExp(',"recording_number":[0-9]+');

    if (this.items[recording.getData(this.primaryKey)]) {
        testNew = JSON.stringify(recording.getData()).replace(numberReg, '');
        testOld = JSON.stringify(this.items[recording.getData(this.primaryKey)].getData()).replace(numberReg, '');
        if (testNew == testOld) {
            return this.items[recording[this.primaryKey]];
        }
    }

    item = this.updatesCollection.addItem(recording.getData());
    this.updateItems[recording[this.primaryKey]] = item;

    return item;
};
