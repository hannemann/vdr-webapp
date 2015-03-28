/**
 * @constructor
 * @property {VDRest.Database.Model.Shows} collection
 * @property {VDRest.Database.Model.Shows} updatesCollection
 * @property {VDRest.Database.Model.Shows} tempCollection
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

/**
 * initialize temporary collection
 */
VDRest.Database.Model.Sync.Shows.prototype.init = function () {

    var collectionName;

    VDRest.Database.Model.Sync.Abstract.prototype.init.call(this);

    this.type = this._class.split('.').pop();

    collectionName = this.collectionItemModel || this.type;

    this.tempCollection = this.module.getModel(collectionName);
    this.tempItems = {};
};

/**
 * @param {{}} media
 * @returns {*}
 */
VDRest.Database.Model.Sync.Shows.prototype.addItem = function (media) {

    var item, testNew, testOld;

    if (this.items[media[this.primaryKey]]) {
        testNew = JSON.stringify(this.module.getModel(this.collection.collectionItemModel, media).getData());
        testOld = JSON.stringify(this.items[media[this.primaryKey]].getData());
        if (testNew == testOld) {
            return this.items[media[this.primaryKey]];
        }
    }

    item = this.updatesCollection.addItem(media);
    this.updateItems[media[this.primaryKey]] = item;

    return item;
};

/**
 * @param {{}} media
 * @returns {*}
 */
VDRest.Database.Model.Sync.Shows.prototype.addTempItem = function (media) {

    var item;

    media = VDRest.Database.Model.Shows.Show.prototype.initMedia(media);

    item = this.tempCollection.addItem(media);
    this.tempItems[media[this.primaryKey]] = item;

    return item;
};

/**
 * @param id
 * @returns {Boolean|*}
 */
VDRest.Database.Model.Sync.Abstract.prototype.getTempItem = function (id) {

    if (this.tempItems[id]) {
        return this.tempItems[id];
    }
    return false;
};
