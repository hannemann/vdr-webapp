/**
 * Channels resource
 * @constructor
 */
VDRest.SearchTimer.Model.ChannelGroups = function () {
};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.SearchTimer.Model.ChannelGroups.prototype = new VDRest.Abstract.Model();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.SearchTimer.Model.ChannelGroups.prototype._class = 'VDRest.SearchTimer.Model.ChannelGroups';

/**
 * model to use for collection objects
 * @type {string}
 */
VDRest.SearchTimer.Model.ChannelGroups.prototype.collectionItemModel = 'ChannelGroups.ChannelGroup';

/**
 * name of collection member in ajax result when loaded from API
 * @type {string}
 */
VDRest.SearchTimer.Model.ChannelGroups.prototype.resultCollection = 'groups';

/**
 * event to trigger when collection is loaded
 * @type {{collectionloaded: string}}
 */
VDRest.SearchTimer.Model.ChannelGroups.prototype.events = {

    "collectionloaded": 'channelgroupsloaded'
};

/**
 * @member {object} collection  store for channel models
 * @member {number} data.count  number of currently stored channel objects
 */
VDRest.SearchTimer.Model.ChannelGroups.prototype.init = function () {

    this.collection = [];
    this.currentResult = [];
};

/**
 * fetch resource model and load channels
 * fire callback afterwards
 */
VDRest.SearchTimer.Model.ChannelGroups.prototype.initList = function () {

    this.module.getResource(this.collectionItemModel).load({
        "url": 'channelGroups',
        "callback": this.processCollection.bind(this)
    });
};
