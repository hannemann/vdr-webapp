/**
 * @class
 * @property {object} collection
 * @property {object} data
 * @extends VDRest.Abstract.Model
 */
VDRest.Epg.Model.Channels = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Model}
 */
VDRest.Epg.Model.Channels.prototype = new VDRest.Abstract.Model();

/**
 * classname
 * @type {string}
 * @private
 */
VDRest.Epg.Model.Channels.prototype._class = 'VDRest.Epg.Model.Channels';

/**
 * model to use for collection objects
 * @type {string}
 */
VDRest.Epg.Model.Channels.prototype.collectionItemModel = 'Channels.Channel';

/**
 * name of collection member in ajax result when loaded from API
 * @type {string}
 */
VDRest.Epg.Model.Channels.prototype.resultCollection = 'channels';

/**
 * event to trigger when collection is loaded
 * @type {{collectionloaded: string}}
 */
VDRest.Epg.Model.Channels.prototype.events = {

    "collectionloaded" : 'channelsloaded'
};

/**
 * @member {object} collection  store for channel models
 * @member {number} data.count  number of currently stored channel objects
 */
VDRest.Epg.Model.Channels.prototype.init = function () {

    this.collection = {};
    this.data.count = 0;
};

//Epg.Model.Channels.prototype.getChannel = function (id) {
//
//    return this.module.getModel('Channels.Channel', id);
//};

/**
 * fetch resource model and load channels
 * fire callback afterwards
 */
VDRest.Epg.Model.Channels.prototype.initChannels = function () {

    this.module.getResource('Channels').load({
        "url" : 'channelList',
        "callback" : $.proxy(this.processCollection, this)
    });
};
