/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Shows = function () {};

/**
 * @type {VDRest.Database.Model.Database.Collection}
 */
VDRest.Database.Model.Shows.prototype = new VDRest.Database.Model.Database.Collection();

/**
 * @type {String}
 */
VDRest.Database.Model.Shows.prototype.primaryKey = "series_id";

/**
 * object store name
 * @type {string}
 */
VDRest.Database.Model.Shows.prototype.oStore = 'shows';

/**
 * class of collection items
 * @type {string}
 */
VDRest.Database.Model.Shows.prototype.collectionItemModel = 'Shows.Show';

/**
 * name attribute
 * @type {string}
 */
VDRest.Database.Model.Shows.prototype.nameAttribute = 'name';

/**
 * name attribute
 * @type {string}
 */
VDRest.Database.Model.Shows.prototype.genreAttribute = 'genre';

/**
 * sort by vote average, best first
 * @param a
 * @param b
 * @returns {number}
 */
VDRest.Database.Model.Shows.prototype.sortRating = function (a, b) {

    a = a.data.rating;
    b = b.data.rating;

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
};
