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
    this.deleteItems = [];
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

    var item;
    //var item, tester;

    //if (this.items[media[this.primaryKey]]) {
    //    tester = this.module.getModel(this.collection.collectionItemModel, media);
    //    if (JSON.stringify(tester.getData()) == JSON.stringify(this.items[media[this.primaryKey]].getData())) {
    //        return this.items[media[this.primaryKey]];
    //    } else {
    //        var lala;
    //    }
    //}

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

    var i;

    for (i in this.items) {
        if (this.items.hasOwnProperty(i) && !this.updateItems[i]) {
            this.deleteCollection.addItem(this.items[i].getData());
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
VDRest.Database.Model.Sync.Abstract.prototype.countdelete = function () {

    return this.deleteCollection.count();
};
