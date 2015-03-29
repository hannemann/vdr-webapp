/**
 * Channels resource
 * @constructor
 * @property {VDRest.Recordings.Model.List.Recording[]} collection        store for recordings models
 * @property {VDRest.Recordings.Model.List.Recording[]} currentResult     last loaded recordings
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
 * @type {boolean}
 */
VDRest.Recordings.Model.List.prototype.lastSync = 0;

/**
 * event to trigger when collection is loaded
 * @type {Object.<string>}
 */
VDRest.Recordings.Model.List.prototype.events = {

    "collectionloaded" : 'recordingsloaded',
    "updatesloaded" : "recordingsupdatesloaded"
};

/**
 * initialize
 */
VDRest.Recordings.Model.List.prototype.init = function () {

    var syncInterval = VDRest.config.getItem('recordingsSyncInterval');

    this.collection = [];
    this.currentResult = [];

    setInterval(this.autoUpdate.bind(this), syncInterval);

    $document.on('visibilitychange', function () {

        if (VDRest.helper.isVisible() && Date.now() - this.lastSync > syncInterval) {

            this.autoUpdate()
        }
    }.bind(this));
};

/**
 * trigger update if connection is available
 */
VDRest.Recordings.Model.List.prototype.autoUpdate = function () {

    if (VDRest.helper.hasConnection()) {
        this.getUpdates();
    }
};

/**
 * fetch resource model and load recordings
 * fire callback afterwards
 */
VDRest.Recordings.Model.List.prototype.initList = function () {

    $document.one(this.events.collectionloaded, function () {

        this.hasCollection = true;
    }.bind(this));

    this.load();
};

/**
 * load collection from db
 */
VDRest.Recordings.Model.List.prototype.fetchFromDb = function () {

    var db = this.module.getModel('List.Recording.DBCollection');


    db.load(null, function () {

        var collection = db.getCollection(),
            l = collection.length;

        if (l == 0) {
            this.load();
        }

        this.collection = db.getCollection();
        this.triggerCollectionLoaded();
    }.bind(this));

};

/**
 * load collection from vdr
 */
VDRest.Recordings.Model.List.prototype.load = function () {

    this.module.getResource(this.collectionItemModel).load({
        "url": 'recordingList',
        "callback": this.processCollection.bind(this)
    });
};

/**
 * fetch resource model and load updates
 */
VDRest.Recordings.Model.List.prototype.getUpdates = function () {

    if (!this.hasCollection) {
        return;
    }

    this.module.getResource(this.collectionItemModel).load({
        "url" : 'recordingsUpdates',
        "callback": this.processUpdates.bind(this)
    });
};

/**
 * send list of file_name,hash pairs
 */
VDRest.Recordings.Model.List.prototype.sync = function () {

    var clientList = [];

    this.collection.forEach(function (recording) {

        clientList.push(recording.data.file_name + ',' + recording.data.hash);

    }.bind(this));

    this.module.getResource(this.collectionItemModel).getSyncList(clientList, this.processUpdates.bind(this));
};

/**
 * process updates
 * fire callback afterwards
 * @param {{}} result
 */
VDRest.Recordings.Model.List.prototype.processUpdates = function (result) {

    result[this.resultCollection].forEach(this.doUpdate.bind(this));

    if (result[this.resultCollection].length > 0) {
        $.event.trigger({
            "type": this.events.updatesloaded
        });
    }

    this.lastSync = Date.now();
};

/**
 * @param {recordingData} recording
 */
VDRest.Recordings.Model.List.prototype.doUpdate = function (recording) {

    var exists = this.hasRecording(recording.file_name),
        model = this.module.getModel(this.collectionItemModel, recording);

    switch (recording.sync_action) {
        case 'add':
            if(exists) {
                this.updateRecording(model, recording)
            } else {
                this.collection.push(model);
            }
            break;
        case 'delete':
            if (exists) {
                this.deleteFromCollection(model);
                delete this.module.cache.store.Model[this.collectionItemModel][recording.file_name];
            }
            break;
        default:
            if (exists) {
                this.updateRecording(model, recording);
            }
    }
};

/**
 * test if recording is cached
 * @param {string} fileName
 * @return {boolean}
 */
VDRest.Recordings.Model.List.prototype.hasRecording = function (fileName) {

    return "undefined" !== typeof this.module.cache.store.Model[this.collectionItemModel][fileName];
};

/**
 * update recordings model
 * @param {VDRest.Recordings.Model.List.Recording} model
 * @param {{}} recording
 */
VDRest.Recordings.Model.List.prototype.updateRecording = function (model, recording) {

    this.deleteFromCollection(model);
    model.data = recording;
    this.collection.push(model);
};

/**
 * truncate collection
 * @returns {VDRest.Recordings.Model.List}
 */
VDRest.Recordings.Model.List.prototype.reset = function () {

    this.collection = [];
    return this;
};

/**
 * fetch recording by file name
 * @param {String} fileName
 * @returns {boolean|VDRest.Recordings.Model.List.Recording}
 */
VDRest.Recordings.Model.List.prototype.getByFileName = function (fileName) {

    var recording = false;

    this.collection.forEach(function (item) {
        if (fileName === item.getData('file_name')) {
            recording = item;
        }
    });

    return recording;
};

/**
 * flush collection
 */
VDRest.Recordings.Model.List.prototype.flushCollection = function () {

    this.hasCollection = false;
    VDRest.Abstract.Model.prototype.flushCollection.call(this);
};
