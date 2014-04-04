VDRest.Abstract = VDRest.Abstract || function () {};

VDRest.Abstract.Model = function () {};

VDRest.Abstract.Model.prototype = new VDRest.Lib.Object();

VDRest.Abstract.Model.prototype.identifier = 'id';

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