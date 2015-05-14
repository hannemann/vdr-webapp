/**
 * Channels resource
 * @constructor
 */
VDRest.SearchTimer.Model.Blacklists = function () {
};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.SearchTimer.Model.Blacklists.prototype = new VDRest.Abstract.Model();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.SearchTimer.Model.Blacklists.prototype._class = 'VDRest.SearchTimer.Model.Blacklists';

/**
 * model to use for collection objects
 * @type {string}
 */
VDRest.SearchTimer.Model.Blacklists.prototype.collectionItemModel = 'Blacklists.Blacklist';

/**
 * name of collection member in ajax result when loaded from API
 * @type {string}
 */
VDRest.SearchTimer.Model.Blacklists.prototype.resultCollection = 'blacklists';

/**
 * event to trigger when collection is loaded
 * @type {{collectionloaded: string}}
 */
VDRest.SearchTimer.Model.Blacklists.prototype.events = {

    "collectionloaded": 'blacklistsloaded'
};

/**
 * @member {object} collection  store for channel models
 * @member {number} data.count  number of currently stored channel objects
 */
VDRest.SearchTimer.Model.Blacklists.prototype.init = function () {

    this.collection = [];
    this.currentResult = [];
};

/**
 * fetch resource model and load channels
 * fire callback afterwards
 */
VDRest.SearchTimer.Model.Blacklists.prototype.initList = function () {

    this.module.getResource(this.collectionItemModel).load({
        "url": 'blacklists',
        "callback": this.processCollection.bind(this)
    });
};
