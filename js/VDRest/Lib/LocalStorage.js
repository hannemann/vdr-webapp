/**
 * read from and write to localStorage
 * @constructor
 */
VDRest.Lib.LocalStorage = function () {};

/**
 * read from and write to localStorage
 * @constructor
 */
VDRest.Lib.LocalStorage.prototype.init = function () {

    var storage = null;

    try {

        if ('localStorage' in window && window['localStorage'] !== null) {

            storage = localStorage;
        }

    } catch (e) {

        throw 'No localStorage available.';
    }

    /**
     * persist item in storage
     * @param {String} k
     * @param {String} v
     * @return {*}
     */
    this.setItem = function (k, v) {

        storage.setItem(k, v);

        return this;
    };

    /**
     * retrieve item from storage
     * if not found lookup defaults
     * @param k
     * @return {*}
     */
    this.getItem = function (k) {

        return storage.getItem(k);
    };

    /**
     * remove item from storage
     * @param k
     * @return {*}
     */
    this.removeItem = function (k) {

        storage.removeItem(k);
        return this;
    };

    /**
     * clear whole storage
     * @return {*}
     */
    this.clear = function () {

        storage.clear();
        return this;
    };

    return this;
};