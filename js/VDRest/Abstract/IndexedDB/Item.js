/**
 * @class
 * @constructor
 */
VDRest.Abstract.IndexedDB.Item = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Abstract.IndexedDB.Item.prototype = new VDRest.Abstract.IndexedDB();

/**
 * initialize data
 */
VDRest.Abstract.IndexedDB.Item.prototype.initData = function (data) {

    var fetch = function () {
        this.load(data, function (result) {
            VDRest.Lib.Object.prototype.initData.call(this, result);
            "function" === typeof this.onload && this.onload(this);
        }.bind(this));
    }.bind(this);

    VDRest.Abstract.IndexedDB.prototype.initData.call(this);

    if (data && "object" !== typeof data) {

        if (this.readystate < 4) {
            this.onreadystatechange = function (state) {

                if (4 == state) fetch();
            }
        } else {
            fetch()
        }
    } else {
        VDRest.Lib.Object.prototype.initData.call(this, data);
    }
};

/**
 * load data
 */
VDRest.Abstract.IndexedDB.Item.prototype.load = function (id, callback) {

    var transaction = this.getTransaction([this.oStore]),
        store = transaction.objectStore(this.oStore),
        request;

    request = store.get(id);

    request.onerror = this.onerror.bind(this);
    request.onsuccess = function (e) {
        callback(e.target.result)
    }.bind(this);
};

/**
 * persist data
 */
VDRest.Abstract.IndexedDB.Item.prototype.save = function (callback) {

    var transaction, store, persist = function () {

        transaction = this.getTransaction([this.oStore]);
        store = transaction.objectStore(this.oStore);

        transaction.onerror = this.onerror.bind(this);

        if ("function" == typeof callback) {
            transaction.oncomplete = callback;
        }

        store.delete(this.getData(this.primaryKey));
        store.add(this.getData());
        "function" === typeof this.onsave && this.onsave(this);

    }.bind(this);

    if (this.readystate < 4) {
        this.onreadystatechange = function (state) {

            if (4 == state) persist();
        }
    } else {
        persist()
    }
};

/**
 * persist data
 */
VDRest.Abstract.IndexedDB.Item.prototype.unlink = function (callback) {

    var transaction, store, unlink = function () {

        transaction = this.getTransaction([this.oStore]);
        store = transaction.objectStore(this.oStore);

        transaction.onerror = this.onerror.bind(this);

        if ("function" == typeof callback) {
            transaction.oncomplete = callback;
        }

        store.delete(this.getData(this.primaryKey));
        "function" === typeof this.onunlink && this.onunlink(this);

    }.bind(this);

    if (this.readystate < 4) {
        this.onreadystatechange = function (state) {

            if (4 == state) unlink();
        }
    } else {
        unlink()
    }
};
