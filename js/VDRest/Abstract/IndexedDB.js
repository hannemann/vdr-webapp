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
 * class name
 * @type {string}
 * @private
 */
VDRest.Abstract.IndexedDB.prototype._class = undefined;

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
VDRest.Abstract.IndexedDB.prototype.obStoresStruct = {};

/**
 * default store -> override!
 * @type {string}
 */
VDRest.Abstract.IndexedDB.prototype.oStore = '';

/**
 * initialize database
 */
VDRest.Abstract.IndexedDB.prototype.init = function () {

    this.request = indexedDB.open(this.dbName, this.dbVersion);
    this.request.onerror = $.proxy(this.onerror, this);
    this.request.onsuccess = $.proxy(this.onsuccess, this);
    this.request.onupgradeneeded = $.proxy(this.onupgradeneeded, this);
};

/**
 * retrieve transaction
 * @param {String} store
 * @param {String} [type]
 * @returns {*}
 */
VDRest.Abstract.IndexedDB.prototype.getTransaction = function (store, type) {

    var i;
    store = store || [];
    type = type || 'readwrite';

    if (!store) {
        for (i in this.obStoresStruct) {
            if (this.obStoresStruct.hasOwnProperty(i)) {
                store.push(i);
            }
        }
    }

    return this.db.transaction(store, type);
};

/**
 * default success handler
 * @param e
 */
VDRest.Abstract.IndexedDB.prototype.onsuccess = function (e) {

    this.db = e.target.result;
};

/**
 * default error handler
 * @param e
 */
VDRest.Abstract.IndexedDB.prototype.onerror = function (e) {

    VDRest.helper.log(e);
};