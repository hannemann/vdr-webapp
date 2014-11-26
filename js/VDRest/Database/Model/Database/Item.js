/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Database.Item = function () {
};

/**
 * @type {VDRest.Lib.Object}
 */
VDRest.Database.Model.Database.Item.prototype = new VDRest.Abstract.IndexedDB.Item();

/**
 * @type {String}
 */
VDRest.Database.Model.Database.Item.prototype.dbName = VDRest.Database.Model.Database.Resource.prototype.dbName;

/**
 * default db version -> override!
 * @type {number}
 */
VDRest.Database.Model.Database.Item.prototype.dbVersion = VDRest.Database.Model.Database.Resource.prototype.dbVersion;

/**
 * retrieve text
 * @param {String} type overview, title...
 * @returns {String|Boolean}
 */
VDRest.Database.Model.Database.Item.prototype.getText = function (type) {

    if (this.data[type] && this.data[type] != '') {
        return this.data[type]
    }

    return false;
};