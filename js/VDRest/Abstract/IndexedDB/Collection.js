/**
 * @class
 * @constructor
 */
VDRest.Abstract.IndexedDB.Collection = function () {};

/**
 * @type {VDRest.Lib.Object}
 */
VDRest.Abstract.IndexedDB.Collection.prototype = new VDRest.Abstract.IndexedDB();

/**
 * initialize data store
 */
VDRest.Abstract.IndexedDB.Collection.prototype.initData = function () {

    var collection = [], index = 0;

    /**
     * iterator pattern valid method
     * @returns {boolean}
     */
    var valid = function () {
        return index <= collection.length;
    };

    /**
     * iterator pattern reset method
     * @returns {*}
     */
    var first = function () {
        index = 0;
        return next();
    };

    /**
     * iterator pattern next method
     * @returns {*}
     */
    var next = function () {
        return collection[index++];
    };

    /**
     * iterate collection
     * @param {Function} callback
     * @param {Function} [complete]
     */
    var iterate = function (callback, complete) {

        var item;
        for (item = first(); valid(); item = next()) {
            callback(item);
        }
        if ("function" == typeof complete) {
            complete(this);
        }
    };

    /**
     * public iterator api
     * @param {Function} callback
     * @param {Function} [complete]
     */
    this.each = function (callback, complete) {

        if (collection.length == 0) {
            this.load(iterate.bind(this, callback, complete));
        } else {
            iterate(callback, complete);
        }
    };

    /**
     * retrieve collection
     * @returns {Array}
     */
    this.getCollection = function () {
        return collection;
    };

    /**
     * add item
     * @param {*} item
     */
    this.addItem = function (item) {
        collection.push(item);
    };
};

/**
 * retrieve collection from database
 */
VDRest.Abstract.IndexedDB.Collection.prototype.load = function (callback) {

    var transaction = this.getTransaction([this.oStore]),
        store = transaction.objectStore(this.oStore);

    store.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            this.addItem(cursor.value);
            cursor.continue();
        }
        else {
            callback();
        }
    }.bind(this);
};

/**
 * reset collection
 */
VDRest.Abstract.IndexedDB.Collection.prototype.reset = function () {

    this.getCollection().length = 0;
};

/**
 * count collection
 * @returns {Number}
 */
VDRest.Abstract.IndexedDB.Collection.prototype.count = function () {

    return this.getCollection().length;
};