/**
 * Channels resource
 * @constructor
 */
VDRest.SearchTimer.Model.RecordingDirs = function () {
};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.SearchTimer.Model.RecordingDirs.prototype = new VDRest.Abstract.Model();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.SearchTimer.Model.RecordingDirs.prototype._class = 'VDRest.SearchTimer.Model.RecordingDirs';

/**
 * model to use for collection objects
 * @type {string}
 */
VDRest.SearchTimer.Model.RecordingDirs.prototype.collectionItemModel = 'RecordingDirs.RecordingDir';

/**
 * name of collection member in ajax result when loaded from API
 * @type {string}
 */
VDRest.SearchTimer.Model.RecordingDirs.prototype.resultCollection = 'dirs';

/**
 * event to trigger when collection is loaded
 * @type {{collectionloaded: string}}
 */
VDRest.SearchTimer.Model.RecordingDirs.prototype.events = {

    "collectionloaded": 'recordingdirsloaded'
};

/**
 * @member {object} collection  store for channel models
 * @member {number} data.count  number of currently stored channel objects
 */
VDRest.SearchTimer.Model.RecordingDirs.prototype.init = function () {

    this.collection = [];
    this.currentResult = [];
};

/**
 * fetch resource model and load channels
 * fire callback afterwards
 */
VDRest.SearchTimer.Model.RecordingDirs.prototype.initList = function () {

    this.module.getResource(this.collectionItemModel).load({
        "url": 'recordingdirs',
        "callback": this.processCollection.bind(this)
    });
};
