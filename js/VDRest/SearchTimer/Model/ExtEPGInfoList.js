/**
 * Channels resource
 * @constructor
 */
VDRest.SearchTimer.Model.ExtEPGInfoList = function () {
};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.SearchTimer.Model.ExtEPGInfoList.prototype = new VDRest.Abstract.Model();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.SearchTimer.Model.ExtEPGInfoList.prototype._class = 'VDRest.SearchTimer.Model.ExtEPGInfoList';

/**
 * model to use for collection objects
 * @type {string}
 */
VDRest.SearchTimer.Model.ExtEPGInfoList.prototype.collectionItemModel = 'ExtEPGInfoList.ExtEPGInfo';

/**
 * name of collection member in ajax result when loaded from API
 * @type {string}
 */
VDRest.SearchTimer.Model.ExtEPGInfoList.prototype.resultCollection = 'ext_epg_info';

/**
 * event to trigger when collection is loaded
 * @type {{collectionloaded: string}}
 */
VDRest.SearchTimer.Model.ExtEPGInfoList.prototype.events = {

    "collectionloaded": 'extepginfosloaded'
};

/**
 * @member {object} collection  store for channel models
 * @member {number} data.count  number of currently stored channel objects
 */
VDRest.SearchTimer.Model.ExtEPGInfoList.prototype.init = function () {

    this.collection = [];
    this.currentResult = [];
};

/**
 * fetch resource model and load channels
 * fire callback afterwards
 */
VDRest.SearchTimer.Model.ExtEPGInfoList.prototype.initList = function () {

    this.module.getResource(this.collectionItemModel).load({
        "url": 'exptEPGInfoList',
        "callback": this.processCollection.bind(this)
    });
};