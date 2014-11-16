/**
 * @class Abstract model
 * @constructor
 */
VDRest.Abstract.IndexedDB.Database = function () {};

/**
 * prototype
 * @type {VDRest.Lib.Object}
 */
VDRest.Abstract.IndexedDB.Database.prototype = new VDRest.Abstract.IndexedDB();

/**
 * @param e
 */
VDRest.Abstract.IndexedDB.Database.prototype.onupgradeneeded = function (e) {

    /**
     * @type {IDBDatabase}
     */
    var db = e.target.result, i, n, struct = this.obStoresStruct, store;

    for (i in struct) {

        if (struct.hasOwnProperty(i)) {

            if (db.objectStoreNames.contains(i)) db.deleteObjectStore(i);
            struct[i].store = db.createObjectStore(i, struct[i].keys);
            if (struct[i].hasOwnProperty('indexes')) {
                for (n in struct[i].indexes) {
                    if (struct[i].indexes.hasOwnProperty(n)) {
                        struct[i].store.createIndex.apply(struct[i].store, struct[i].indexes[n]);
                    }
                }
            }
        }
    }
    for (i in db.objectStoreNames) {
        store = db.objectStoreNames[i];
        if (db.objectStoreNames.contains(store) && !struct[store]) {
            db.deleteObjectStore(store);
        }
    }
};
