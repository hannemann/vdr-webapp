var Abstract = Abstract || function () {};

Abstract.Model = function () {};

Abstract.Model.prototype = new Lib.Object();

Abstract.Model.prototype.identifier = 'id';

Abstract.Model.prototype.processCollection = function (result) {

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

Abstract.Model.prototype.collectionIterator = function (callback) {

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