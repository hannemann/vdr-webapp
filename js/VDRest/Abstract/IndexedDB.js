window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

/**
 * @class
 * @constructor
 */
VDRest.Abstract.IndexedDB = function () {};

/**
 * prototype
 * @type {VDRest.Lib.Object}
 */
VDRest.Abstract.IndexedDB.prototype = new VDRest.Lib.Object();

/**
 * default identifier field
 * models are stored in cache width value of field identifier
 * in its data
 * e.g. channels objects have unique identifier called number or channel_id
 * override property if 'id' is not appropriate
 * @type {string}
 */
VDRest.Abstract.IndexedDB.prototype.cacheKey = undefined;

/**
 * default db name -> override!
 * @type {string}
 */
VDRest.Abstract.IndexedDB.prototype.dbName = 'Default';

/**
 * default db version -> override!
 * @type {number}
 */
VDRest.Abstract.IndexedDB.prototype.dbVersion = 1;

/**
 * default db structure -> override!
 * @type {Array}
 */
VDRest.Abstract.IndexedDB.prototype.obStoresStruct = null;

/**
 * default store -> override!
 * @type {string}
 */
VDRest.Abstract.IndexedDB.prototype.oStore = null;

/**
 * initialize database
 * @throws {Error}
 */
VDRest.Abstract.IndexedDB.prototype.init = function () {

    if (!this.oStore && !this.obStoresStruct) {
        throw new Error('No oStore or obStoresStruct property defined');
    }
    this.readyStateChange(1);

    this.request = indexedDB.open(this.dbName, this.dbVersion);
    this.request.onerror = $.proxy(this.onerror, this);
    this.request.onsuccess = $.proxy(this.onsuccess, this);
    this.request.onupgradeneeded = $.proxy(this.onupgradeneeded, this);
    this.readyStateChange(2);
};

/**
 * initialize database
 * @throws {Error}
 */
VDRest.Abstract.IndexedDB.prototype.readyStateChange = function (state) {

    this.readystate = state;
    if ("function" === typeof this.onreadystatechange) {
        this.onreadystatechange(state);
    }
};

/**
 * retrieve transaction
 * @param {String} [store]
 * @param {String} [type]
 * @returns {IDBTransaction}
 */
VDRest.Abstract.IndexedDB.prototype.getTransaction = function (store, type) {

    var i;
    store = store || [];
    type = type || 'readwrite';

    if (store.length === 0) {
        if (this.obStoresStruct) {
            for (i in this.obStoresStruct) {
                if (this.obStoresStruct.hasOwnProperty(i)) {
                    store.push(i);
                }
            }
        } else {
            store.push(this.oStore);
        }
    }

    return this.db.transaction(store, type);
};

/**
 * @throws {Error}
 */
VDRest.Abstract.IndexedDB.prototype.onupgradeneeded = function () {

    throw new Error('No onupgradeneeded method implemented')
};

/**
 * default success handler
 * @param e
 */
VDRest.Abstract.IndexedDB.prototype.onsuccess = function (e) {

    this.db = e.target.result;
    this.readyStateChange(4);
};

/**
 * default error handler
 * @param e
 */
VDRest.Abstract.IndexedDB.prototype.onerror = function (e) {

    VDRest.helper.log(e);
};