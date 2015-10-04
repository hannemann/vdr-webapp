/**
 * @class
 * @property {Array.<VDRest.Epg.Model.Channels.Channel>} collection
 * @property {Array.<VDRest.Epg.Model.Channels.Channel>} currentResult
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
 * class name
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

    this.collection = [];
    this.currentResult = [];
};

/**
 * fetch resource model and load channels
 * fire callback afterwards
 */
VDRest.Epg.Model.Channels.prototype.initChannels = function () {

    this.module.getResource(this.collectionItemModel)
        .setChannelLimit()
        .load({
        "url" : 'channelList',
            "callback": this.processCollection.bind(this)
    });
};

/**
 * retrieve the next channel (channel +)
 * @param {VDRest.Epg.Model.Channels.Channel} channel
 * @returns {VDRest.Epg.Model.Channels.Channel|Boolean}
 */
VDRest.Epg.Model.Channels.prototype.getNextChannel = function (channel) {

    var i= 0, l = this.collection.length;

    for (i;i<l;i++) {
        if (this.collection[i] == channel) {
            return this.collection[i+1];
        }
    }
    return false;
};
/**
 * retrieve previous channel (channel -)
 * @param {VDRest.Epg.Model.Channels.Channel} channel
 * @returns {VDRest.Epg.Model.Channels.Channel|Boolean}
 */
VDRest.Epg.Model.Channels.prototype.getPreviousChannel = function (channel) {

    var i= 0, l = this.collection.length;

    for (i;i<l;i++) {
        if (this.collection[i] == channel) {
            return this.collection[i-1];
        }
    }
    return false;
};

/**
 * retrieve channel by name
 * @param {String} name
 */
VDRest.Epg.Model.Channels.prototype.getChannelByName = function (name) {

    var channel;

    this.collection.every(function (item) {
        if (item.getData('name') === name) {
            channel = item;
            return false;
        }
        return true;
    });

    return channel;
};
