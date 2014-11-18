/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Media = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Database.Model.Media.prototype = new VDRest.Lib.Object();

/**
 * initialize data
 */
VDRest.Database.Model.Media.prototype.initData = function (data) {

    if (!this.resource) {

        this.resource = this.module.getResource('Database');
    }

    if (data && "object" !== typeof data) {

        this.load(data, function (result) {
            VDRest.Lib.Object.prototype.initData.call(this, result);
        }.bind(this));
    } else {
        VDRest.Lib.Object.prototype.initData.call(this, data);
    }

};

/**
 * load data
 */
VDRest.Database.Model.Media.prototype.load = function (id, callback) {

    var request;

    request = this.resource.db.transaction(this.oStore)
        .objectStore(this.oStore).get(id);

    request.onerror = this.onerror.bind(this);
    request.onsuccess = onsuccess = function (e) {
        callback(e.target.result)
    }.bind(this);
};

/**
 * persist data
 */
VDRest.Database.Model.Media.prototype.persist = function (callback) {

    var transaction = this.resource.getTransaction([this.oStore]),
        store = transaction.objectStore(this.oStore);

    transaction.onerror = this.onerror.bind(this);

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
