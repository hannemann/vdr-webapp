/**
 * Channels resource
 * @constructor
 */
VDRest.Timer.Model.List = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Timer.Model.List.prototype = new VDRest.Abstract.Model();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Timer.Model.List.prototype._class = 'VDRest.Timer.Model.List';

/**
 * model to use for collection objects
 * @type {string}
 */
VDRest.Timer.Model.List.prototype.collectionItemModel = 'List.Timer';

/**
 * name of collection member in ajax result when loaded from API
 * @type {string}
 */
VDRest.Timer.Model.List.prototype.resultCollection = 'timers';

/**
 * event to trigger when collection is loaded
 * @type {{collectionloaded: string}}
 */
VDRest.Timer.Model.List.prototype.events = {

    "collectionloaded" : 'timersloaded'
};

/**
 * @member {object} collection  store for channel models
 * @member {number} data.count  number of currently stored channel objects
 */
VDRest.Timer.Model.List.prototype.init = function () {

    this.collection = [];
    this.currentResult = [];
};

/**
 * fetch resource model and load channels
 * fire callback afterwards
 */
VDRest.Timer.Model.List.prototype.initList = function () {

    this.module.getResource(this.collectionItemModel).load({
        "url" : 'timerList',
        "callback" : $.proxy(this.processCollection, this)
    });
};

VDRest.Timer.Model.List.prototype.sortByTime = function (a, b) {

    a = parseInt(a.data.start_timestamp.replace(/[^0-9]/g, ''));
    b = parseInt(b.data.start_timestamp.replace(/[^0-9]/g, ''));

    return a - b;
};