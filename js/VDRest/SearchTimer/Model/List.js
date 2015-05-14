/**
 * Channels resource
 * @constructor
 */
VDRest.SearchTimer.Model.List = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.SearchTimer.Model.List.prototype = new VDRest.Abstract.Model();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.SearchTimer.Model.List.prototype._class = 'VDRest.SearchTimer.Model.List';

/**
 * model to use for collection objects
 * @type {string}
 */
VDRest.SearchTimer.Model.List.prototype.collectionItemModel = 'List.SearchTimer';

/**
 * name of collection member in ajax result when loaded from API
 * @type {string}
 */
VDRest.SearchTimer.Model.List.prototype.resultCollection = 'searchtimers';

/**
 * event to trigger when collection is loaded
 * @type {{collectionloaded: string}}
 */
VDRest.SearchTimer.Model.List.prototype.events = {

    "collectionloaded" : 'searchtimersloaded'
};

/**
 * @member {object} collection  store for channel models
 * @member {number} data.count  number of currently stored channel objects
 */
VDRest.SearchTimer.Model.List.prototype.init = function () {

    this.collection = [];
    this.currentResult = [];
};

/**
 * fetch resource model and load channels
 * fire callback afterwards
 */
VDRest.SearchTimer.Model.List.prototype.initList = function () {

    this.module.getResource(this.collectionItemModel).load({
        "url" : 'searchTimerList',
        "callback": this.processCollection.bind(this)
    });
};

/**
 * callback
 */
VDRest.SearchTimer.Model.List.prototype.afterCollectionLoaded = function () {

    this.collection.sort(function (a, b) {

        a = a.data.search.toLowerCase().replace(/^[^a-z]/, '');
        b = b.data.search.toLowerCase().replace(/^[^a-z]/, '');

        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });
};
