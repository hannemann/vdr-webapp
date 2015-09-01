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
 * indicates if object cache entry can be invalidated
 * @type {boolean}
 */
VDRest.Abstract.Model.prototype.canInvalidate = undefined;

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
VDRest.Abstract.Model.prototype._class = undefined;

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

    var evt = {};

    if (this.events.collectionloaded instanceof Object) {
        evt.type = this.events.collectionloaded.type;
        if ("undefined" !== typeof this.events.collectionloaded.payload) {
            evt.payload = this.events.collectionloaded.payload;
        }
    } else {
        evt.type = this.events.collectionloaded;
    }

    evt.collection = this.currentResult;
    evt._class = this._class;
    evt.iterate = this.resultIterator.bind(this);

    $.event.trigger(evt);
};

/**
 * default result iterator
 * @param {function} callback
 * @param {function} [complete]
 */
VDRest.Abstract.Model.prototype.resultIterator = function (callback, complete) {

    var i = 0, l = this.currentResult.length, n = true;

    for (i;i<l;i++) {

        n = callback(this.currentResult[i]);

        if (n === false) {
            break;
        }
    }

    if ("function" === typeof complete) {

        complete(this.currentResult);
    }
};

/**
 * default collection iterator
 * @param {function} callback
 * @param {function} [complete]
 */
VDRest.Abstract.Model.prototype.collectionIterator = function (callback, complete) {

    var i = 0, l = this.collection.length;

    for (i;i<l;i++) {

        callback(this.collection[i]);
    }

    if ("function" === typeof complete) {

        complete(this.currentResult);
    }
};

/**
 * delete model from collection
 * @param model
 */
VDRest.Abstract.Model.prototype.deleteFromCollection = function (model) {

    var i = 0, l = this.collection.length;

    for (i;i<l;i++) {

        if (this.collection[i] === model) {

            this.collection.splice(i, 1);
        }
    }
};

/**
 * flush collection
 */
VDRest.Abstract.Model.prototype.flushCollection = function () {

    this.collection.forEach(function (model) {
        if ("function" === typeof model.removeObserver) {
            model.removeObserver();
        }
        delete model.cache[model.keyInCache];
    });

    this.collection = [];
    this.currentResult = [];
};

/**
 * retrieve collection
 */
VDRest.Abstract.Model.prototype.getCollection = function () {

    return this.collection;
};

/**
 * ** deprecated **
 *
 *
 * load single data set identified by cache key
 * create collection model instance if not cached already
 * @param cacheKey
 * @param {Function} callback
 * @returns {boolean}
 */
VDRest.Abstract.Model.prototype.loadCollectionItem = function (cacheKey, callback) {

    var model = false;

    if ("undefined" !== typeof this.collectionItemModel) {

        if (
            "undefined" !== typeof this.cache[this.collectionItemModel]
            && this.cache[this.collectionItemModel][cacheKey]
        ) {

            callback(this.cache[this.collectionItemModel][cacheKey]);

        } else {

            this.module.getResource(this.collectionItemModel, cacheKey)
                .setIdUrl(cacheKey)
                .load({
                    "callback": function (response) {

                        model = this.module.getModel(
                            this.collectionItemModel,
                            response[this.resultCollection][0]
                        );

                        callback(model);
                    }.bind(this),
                    "url" : "byId"
                })
            ;
        }
    }
};