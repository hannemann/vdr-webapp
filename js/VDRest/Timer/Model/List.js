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
        "callback": this.processCollection.bind(this)
    });
};

/**
 * sort callback
 * @param a
 * @param b
 * @returns {number}
 */
VDRest.Timer.Model.List.prototype.sortByTime = function (a, b) {

    a = parseInt(a.data.start_timestamp.replace(/[^0-9]/g, ''));
    b = parseInt(b.data.start_timestamp.replace(/[^0-9]/g, ''));

    return a - b;
};

/**
 * @param {Array.<Number>}ids
 */
VDRest.Timer.Model.List.prototype.bulkDelete = function (ids) {

    $window.one("vdrest-api-actions.timer-bulkdeleted", this.handleBulkDeleted.bind(this));

    this.module.getResource('List.Timer').bulkDelete(ids)
};

/**
 * @param {{payload:{timers:Array.<{id:string,deleted:boolean}>}}} result
 */
VDRest.Timer.Model.List.prototype.handleBulkDeleted = function (result) {

    result.payload.timers.forEach(function (timer) {
        if (timer.deleted) {

            $.event.trigger({
                "type": "vdrest-api-actions.timer-deleted",
                "payload": timer.id
            });
        }
    }.bind(this))
};
