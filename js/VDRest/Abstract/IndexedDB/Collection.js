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
 * @type {string}
 */
VDRest.Abstract.IndexedDB.Collection.prototype_class = 'VDRest.Abstract.IndexedDB.Collection';

/**
 * retrieve collection from database
 */
VDRest.Abstract.IndexedDB.Collection.prototype.load = function () {

    var transaction = this.getTransaction([this.oStore]),
        store = transaction.objectStore(this.oStore),
        result = [], onloadevent = this.onloadevent;

    store.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            result.push(cursor.value);
            cursor.continue();
        }
        else {
            $.event.trigger({
                "type" : onloadevent,
                "payload" : {
                    "data" : result
                }
            });
        }
    };
};


