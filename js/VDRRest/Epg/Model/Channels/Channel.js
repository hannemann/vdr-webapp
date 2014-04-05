/**
 * Channel Model
 * @constructor
 */
VDRest.Epg.Model.Channels.Channel = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Epg.Model.Channels.Channel.prototype = new VDRest.Abstract.Model();

/**
 * identifier in result object
 * overrides default
 * @type {string}
 */
VDRest.Epg.Model.Channels.Channel.prototype.identifier = 'channel_id';

/**
 * identifier type in result object
 * overrides default
 * @type {string}
 */
VDRest.Epg.Model.Channels.Channel.prototype.identifierType = 'string';

/**
 * Modelpath
 * @type {string}
 * @private
 */
VDRest.Epg.Model.Channels.Channel.prototype._class = 'VDRest.Epg.Model.Channels.Channel';

/**
 * classpath of model that holds a single broadcast in collection
 * @type {string}
 */
VDRest.Epg.Model.Channels.Channel.prototype.collectionItemModel = 'Channels.Channel.Broadcast';

/**
 * name of collection in ajax result
 * @type {string}
 */
VDRest.Epg.Model.Channels.Channel.prototype.resultCollection = 'events';

/**
 * member of collection entity to replace with this
 * @type {string}
 */
VDRest.Epg.Model.Channels.Channel.prototype.replaceInCollection = 'channel';

/**
 * initialize collection cache
 * do some data transformations
 * @member {object} collection holds collection items VDRest.Epg.Model.Channels.Channel.Broadcast
 * @member {number} data.count number of currently stored broadcast
 * @member {number} lastBroadcastEnd timestamp of the end of the latest broadcast
 * @member {object} events event names
 * @member {string} baseUrl
 * @member {Date} from
 */
VDRest.Epg.Model.Channels.Channel.prototype.init = function () {

    var channelId = this.getData('channel_id');

    this.collection = {};
    this.data.count = 0;
    this.from = this.module[VDRest.config.getItem('lastEpg')];
    this.events = {
        // event to be triggered when collection is loaded
        "collectionloaded" : 'broadcastsloaded-' + channelId
    };

    this.baseUrl = this.module.getResource('Channels').getBaseUrl();

    // add image url if image is true
    if (this.getData('image')) {

        this.setData('image', this.baseUrl + 'channels/image/' + channelId);
    }
};

/**
 * load broadcasts
 * process collection afterwards
 */
VDRest.Epg.Model.Channels.Channel.prototype.getNextBroadcasts = function () {

    this.module.getResource('Channels.Channel', {

        /** add identifier and this to resource */
        "channelId":this.getData('channel_id'),
        "channel" : this

    }).setUrl({"from":parseInt(this.from.getTime()/1000, 10)})
        .load({
            "url" : 'broadcastsHourly',
            "callback" : $.proxy(this.processCollection, this)
    });
};

/**
 * callback
 */
VDRest.Epg.Model.Channels.Channel.prototype.afterCollectionLoaded = function () {
//    console.log(this);
};

