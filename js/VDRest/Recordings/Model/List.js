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

    "collectionloaded" : 'recordingsloaded',
    "updatesloaded" : "recordingsupdatesloaded"
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
 * fetch resource model and load recordings
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

/**
 * fetch resource model and load updates
 */
VDRest.Recordings.Model.List.prototype.getUpdates = function () {

    this.module.getResource(this.collectionItemModel).load({
        "url" : 'recordingsUpdates',
        "callback": this.processUpdates.bind(this)
    });
};

/**
 * process updates
 * fire callback afterwards
 * @param {{}} result
 */
VDRest.Recordings.Model.List.prototype.processUpdates = function (result) {

    result[this.resultCollection].forEach(function (recording) {

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

    }.bind(this));

    if (result[this.resultCollection].length > 0) {
        $.event.trigger({
            "type": this.events.updatesloaded
        });
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
 * flush collection
 */
VDRest.Recordings.Model.List.prototype.flushCollection = function () {

    this.hasCollection = false;
    VDRest.Abstract.Model.prototype.flushCollection.call(this);
};
