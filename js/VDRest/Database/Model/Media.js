/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Media = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Database.Model.Media.prototype = new VDRest.Abstract.Model();

/**
 * initialize
 */
VDRest.Database.Model.Media.prototype.init = function () {

    this.db = this.module.getResource('Database');
};

/**
 * persist data
 */
VDRest.Database.Model.Media.prototype.persist = function (callback) {

    var transaction = this.db.getTransaction([this.oStore]),
        store = transaction.objectStore(this.oStore);

    transaction.onerror = $.proxy(this.onerror, this);

    if ("function" == typeof callback) {
        transaction.oncomplete = callback;
    }

    store.delete(this.getData(this.primaryKey));
    store.add(this.getData());
};

/**
 * error handler
 */
VDRest.Database.Model.Media.prototype.onerror = function (e) {

    VDRest.helper.log(e);
};
