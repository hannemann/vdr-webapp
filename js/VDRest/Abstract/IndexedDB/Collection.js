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

    VDRest.Abstract.IndexedDB.prototype.initData.call(this);

    this.onreadystatechange = function (state) {
        if (4 == state && "function" === typeof this.onload) {
            this.onload(this);
        }
    }.bind(this);

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
            callback(item, index - 1);
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

            if (this.readystate < 4) {
                this.onreadystatechange = function (state) {
                    if (4 == state) this.load(callback, complete);
                }.bind(this)
            } else {
                this.load(callback, complete);
            }
        } else {
            iterate.call(this, callback, complete);
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
        collection.push(this.module.getModel(this.collectionItemModel, item));
        return collection[collection.length-1];
    };

    /**
     * sort collection by given callback function
     * @param {Function} callback
     * @param {Boolean} reverse
     * @param {Function} [complete]
     */
    this.sort = function (callback, reverse, complete) {

        if (collection.length == 0) {

            if (this.readystate < 4) {
                this.onreadystatechange = function (state) {
                    if (4 == state) this.load(undefined, function () {

                        collection.sort(callback);
                        reverse && collection.reverse();
                        "function" === typeof complete && complete();
                    }.bind(this));
                }.bind(this)
            } else {
                this.load(undefined, function () {

                    collection.sort(callback);
                    reverse && collection.reverse();
                    "function" === typeof complete && complete();
                }.bind(this));
            }
        } else {
            collection.sort(callback);
            reverse && collection.reverse();
            "function" === typeof complete && complete();
        }
    };
};

/**
 * retrieve collection from database
 */
VDRest.Abstract.IndexedDB.Collection.prototype.load = function (callback, complete) {

    if (this.readystate < 4) {
        this.onreadystatechange = function (state) {
            if (4 == state) this.doload(callback, complete);
        }.bind(this)
    } else {
        this.doload(callback, complete);
    }
};

/**
 * retrieve collection from database
 */
VDRest.Abstract.IndexedDB.Collection.prototype.doload = function (callback, complete) {

    var transaction = this.getTransaction([this.oStore]),
        store = transaction.objectStore(this.oStore),
        index = 0;

    store.openCursor().onsuccess = function(event) {
        var cursor = event.target.result, item;
        if (cursor) {
            item = this.addItem(cursor.value);
            if ("function" === typeof callback) {
                callback(item, index++);
            }
            cursor.continue();
        }
        else {
            "function" === typeof complete && complete();
        }
    }.bind(this);
};

/**
 * save collection to database
 */
VDRest.Abstract.IndexedDB.Collection.prototype.save = function (callback, complete) {

    if (this.readystate < 4) {
        this.onreadystatechange = function (state) {
            if (4 == state) this.persist(callback, complete);
        }.bind(this)
    } else {
        this.persist(callback, complete);
    }
};

/**
 * persist items
 * @param callback
 * @param complete
 */
VDRest.Abstract.IndexedDB.Collection.prototype.persist = function (callback, complete) {

    var index = 0, collection = this.getCollection(), addItem = function () {

        collection[index].onsave = function (item) {
            callback(item, index);
            index++;
            if (index < collection.length) {
                addItem();
            } else {
                complete();
            }
        };
        collection[index].save()
    };

    addItem();
};

/**
 * truncate collection
 */
VDRest.Abstract.IndexedDB.Collection.prototype.truncate = function (callback, complete) {

    if (this.readystate < 4) {
        this.onreadystatechange = function (state) {
            if (4 == state) this.doDelete(callback, complete);
        }.bind(this)
    } else {
        this.doDelete(callback, complete);
    }
};

/**
 * delete items
 * @param callback
 * @param complete
 */
VDRest.Abstract.IndexedDB.Collection.prototype.doDelete = function (callback, complete) {

    var index = 0, collection = this.getCollection(), deleteItem = function () {

        collection[index].onunlink = function (item) {
            callback(item, index);
            index++;
            if (index < collection.length) {
                deleteItem();
            } else {
                this.reset();
                complete();
            }
        }.bind(this);
        collection[index].unlink()
    }.bind(this);

    deleteItem();
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
