/**
 * @class Abstract model
 * @constructor
 */
VDRest.Abstract.Model = function () {};

/**
 * prototype
 * @type {VDRest.Lib.Object}
 */
VDRest.Abstract.Model.prototype = new VDRest.Lib.Object();

/**
 * default identifier field
 * models are stored in cache width value of field identifier
 * in its data
 * e.g. channels objects have unique identifier called number or channel_id
 * override property if 'id' is not appropriate
 * @type {string}
 */
VDRest.Abstract.Model.prototype.identifier = 'id';

/**
 * default callback when collection is loaded
 * @param result {JSON}
 */
VDRest.Abstract.Model.prototype.processCollection = function (result) {

    var i = 0,
        l = result[this.resultCollection].length,
        model;

    if (this.hasData('count')) {
        this.count = l;
    }

    for (i;i<l;i++) {

        model = this.module.getModel(
            this.collectionItemModel,
            result[this.resultCollection][i]
        );
        model.owner = this;
        this.collection[i] = model;
    }

    if ("function" === typeof this.afterCollectionLoaded) {

        this.afterCollectionLoaded();
    }

    $.event.trigger({
        "type"          : this.events.collectionloaded,
        "collection"    : this.collection,
        "_class"        : this._class,
        "iterate"       : $.proxy(this.collectionIterator, this)
    });
};

/**
 * default collection iterator
 * @param callback {function}
 */
VDRest.Abstract.Model.prototype.collectionIterator = function (callback) {

    var i;

    if ("undefined" === typeof this.collection) {

        throw 'Model has no collection.';
    }

    for (i in this.collection) {

        if (this.collection.hasOwnProperty(i)) {
            callback(this.collection[i]);
        }
    }
};