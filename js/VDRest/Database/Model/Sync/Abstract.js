/**
 * @constructor
 */
VDRest.Database.Model.Sync.Abstract = function () {
};

/**
 * @type {boolean}
 */
VDRest.Database.Model.Sync.Abstract.prototype.bypassCache = true;

/**
 * initialize
 */
VDRest.Database.Model.Sync.Abstract.prototype.init = function () {

    var collectionName;

    this.type = this._class.split('.').pop();

    collectionName = this.collectionItemModel || this.type;

    this.collection = this.module.getModel(collectionName);
    this.updatesCollection = this.module.getModel(collectionName);
    this.deleteCollection = this.module.getModel(collectionName);
    this.items = {};
    this.updateItems = {};
    this.triggeredCallbacks = {};
    this.primaryKey = this.collection.primaryKey;
};

/**
 * load collection from database
 * @param callback
 */
VDRest.Database.Model.Sync.Abstract.prototype.load = function (callback) {

    this.collection.load(function (item) {

        this.items[item.getData(this.primaryKey)] = item;
    }.bind(this), function () {

        this.triggeredCallbacks.load = true;
        callback();
    }.bind(this));
};

/**
 * @param {{}} media
 * @returns {*}
 */
VDRest.Database.Model.Sync.Abstract.prototype.addItem = function (media) {

    var item, testNew, testOld, numberReg = new RegExp(',"recording_number":[0-9]+');

    if (media[this.primaryKey] !== 0 && this.items[media[this.primaryKey]]) {
        testNew = JSON.stringify(this.module.getModel(this.collection.collectionItemModel, media).getData()).replace(numberReg, '');
        testOld = JSON.stringify(this.items[media[this.primaryKey]].getData()).replace(numberReg, '');
        if (testNew == testOld) {
            return this.items[media[this.primaryKey]];
        }
    }

    item = this.updatesCollection.addItem(media);
    this.updateItems[media[this.primaryKey]] = item;

    return item;
};

/**
 * @param id
 * @returns {Boolean|*}
 */
VDRest.Database.Model.Sync.Abstract.prototype.getItem = function (id) {

    if (this.updateItems[id]) {
        return this.updateItems[id];
    }
    return false;
};

/**
 * determine which items to delete
 * @param callback
 */
VDRest.Database.Model.Sync.Abstract.prototype.toDelete = function (callback) {

    var i, hit = false;

    for (i in this.items) {
        if (this.items.hasOwnProperty(i)) {
            this.collection.each(function (item) {
                if (item.id == i) {
                    hit = true;
                }
            }, function () {
                if (!hit) {
                    this.deleteCollection.addItem(this.items[i].getData());
                }
                hit = false;
            }.bind(this));
        }
    }
    this.triggeredCallbacks.toDelete = true;
    callback();
};

/**
 * delete outdated items
 * @param {Function} callback
 * @param {Function} complete
 */
VDRest.Database.Model.Sync.Abstract.prototype.doDelete = function (callback, complete) {

    this.deleteCollection.truncate(callback, complete);
};

/**
 * save updates collection
 * @param {Function} callback
 * @param {Function} complete
 */
VDRest.Database.Model.Sync.Abstract.prototype.save = function (callback, complete) {

    this.updatesCollection.save(callback, complete);
};

/**
 * count database collection
 * @returns {Number}
 */
VDRest.Database.Model.Sync.Abstract.prototype.count = function () {

    return this.collection.count();
};

/**
 * count updates collection
 * @returns {Number}
 */
VDRest.Database.Model.Sync.Abstract.prototype.countUpdates = function () {

    return this.updatesCollection.count();
};

/**
 * count updates collection
 * @returns {Number}
 */
VDRest.Database.Model.Sync.Abstract.prototype.countDelete = function () {

    return this.deleteCollection.count();
};
