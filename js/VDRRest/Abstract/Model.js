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
VDRest.Abstract.Model.prototype.cacheKey = undefined;

/**
 * name of property that holds parent object
 * @type {string}
 */
VDRest.Abstract.Model.prototype.mixIntoCollectionItem = undefined;

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.prototype._class = undefined;

/**
 * default callback when collection is loaded
 * @param result {JSON}
 */
VDRest.Abstract.Model.prototype.processCollection = function (result) {

    var i = 0,
        l = result[this.resultCollection].length,
        model;

    // set currentResult if we have matches already
    if ("undefined" !== typeof this.preprocessedCollection) {

        this.currentResult = this.preprocessedCollection;
        this.preprocessedCollection = undefined;

    } else {

        this.currentResult = [];
    }

    // add loaded entities to result set
    for (i;i<l;i++) {

        if ("undefined" !== typeof this.mixIntoCollectionItem) {

            result[this.resultCollection][i][this.mixIntoCollectionItem] = this;
        }

        model = this.module.getModel(
            this.collectionItemModel,
            result[this.resultCollection][i]
        );

        if ("undefined" === typeof model.isCached) {
            this.collection.push(model);
            model.isCached = true
        }
        this.currentResult.push(model);
    }

    if ("function" === typeof this.afterCollectionLoaded) {

        this.afterCollectionLoaded();
    }

    this.triggerCollectionLoaded();
};

/**
 * trigger event after collection is loaded
 */
VDRest.Abstract.Model.prototype.triggerCollectionLoaded = function () {

    $.event.trigger({
        "type"          : this.events.collectionloaded,
        "collection"    : this.currentResult,
        "_class"        : this._class,
        "iterate"       : $.proxy(this.resultIterator, this)
    });
};

/**
 * default collection iterator
 * @param callback {function}
 */
VDRest.Abstract.Model.prototype.resultIterator = function (callback) {

    var i = 0, l = this.currentResult.length;

    for (i;i<l;i++) {

        callback(this.currentResult[i]);
    }
};