/**
 * Channels resource
 * @constructor
 */
VDRest.Recordings.Model.List = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Recordings.Model.List.prototype = new VDRest.Abstract.Model();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Recordings.Model.List.prototype._class = 'VDRest.Recordings.Model.List';

/**
 * model to use for collection objects
 * @type {string}
 */
VDRest.Recordings.Model.List.prototype.collectionItemModel = 'List.Recording';

/**
 * name of collection member in ajax result when loaded from API
 * @type {string}
 */
VDRest.Recordings.Model.List.prototype.resultCollection = 'recordings';

/**
 * @type {boolean}
 */
VDRest.Recordings.Model.List.prototype.hasCollection = false;

/**
 * event to trigger when collection is loaded
 * @type {{collectionloaded: string}}
 */
VDRest.Recordings.Model.List.prototype.events = {

    "collectionloaded" : 'recordingsloaded'
};

/**
 * @member {object} collection  store for channel models
 * @member {number} data.count  number of currently stored channel objects
 */
VDRest.Recordings.Model.List.prototype.init = function () {

    this.collection = [];
    this.currentResult = [];
};

/**
 * fetch resource model and load channels
 * fire callback afterwards
 */
VDRest.Recordings.Model.List.prototype.initList = function () {

    $document.one(this.events.collectionloaded, function () {

        this.hasCollection = true;
    }.bind(this));

    this.module.getResource(this.collectionItemModel).load({
        "url" : 'recordingList',
        "callback": this.processCollection.bind(this)
    });
};