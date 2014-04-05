
/**
 * Channel Model
 * @class
 * @constructor
 * @var {object} data
 * @property {string} channel_id
 * @property {string} group - groupname channel belongs to
 * @property {string} image - url of channel logo
 * @property {boolean} is_atsc
 * @property {boolean} is_cable
 * @property {boolean} is_sat
 * @property {boolean} is_terr
 * @property {string} name
 * @property {number} number
 * @property {string} stream - filename of stream
 * @property {number} transponder
 *
 * @var {object} events
 * @property {string} collectionloaded
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

    this.collection = [];
    this.currentResult = [];
    this.getFromDate();
    this.events = {
        // event to be triggered when collection is loaded
        "collectionloaded" : 'broadcastsloaded-' + channelId
    };

    this.baseUrl = this.module.getResource('Channels.Channel').getBaseUrl();

    // add image url if image is true
    if (this.getData('image')) {

        this.setData('image', this.baseUrl + 'channels/image/' + channelId);
    }
};

VDRest.Epg.Model.Channels.Channel.prototype.getFromDate = function () {

    this.from = this.module[VDRest.config.getItem('lastEpg')];
    return this.from;
};

/**
 * load broadcasts
 * process collection afterwards
 */
VDRest.Epg.Model.Channels.Channel.prototype.getNextBroadcasts = function () {

    var from = this.collection.length > 0
            ? this.collection[this.collection.length-1].data.end_date
            : this.getFromDate();

    this.getResource()
        .setUrl({
            "from":from
        })
        .load({
            "url" : 'broadcastsHourly',
            "callback" : $.proxy(this.processCollection, this)
        });
};

/**
 * retrieve Broadcast models from point of time
 * @param {Date} from - Date object start
 * @param {Date} [to] - Date object end
 */
VDRest.Epg.Model.Channels.Channel.prototype.getByTime = function (from, to) {

    var
        /** @type {VDRest.Epg.Model.Channels.Channel.Broadcast[]} */
        collection = [],

        /** @type {Date} */
        lastEndTime,

        /** @type {number} */
        i= 0,

        /** @type {number} */
        l=this.collection.length,

        /** @type {VDRest.Epg.Model.Channels.Channel.Broadcast} */
        broadcast;

    from = from && from instanceof Date ? from : this.getFromDate();
    lastEndTime = from;

    to = to && to instanceof Date ? to : new Date(
        from.getTime()
        + VDRest.Epg.Model.Channels.Channel.Broadcast.Resource.prototype.defaultTimeSpan
    );

    // search in collection for broadcasts that math from and to arguments
    for (i;i<l;i++) {

        broadcast = this.collection[i];
        if (broadcast.shownBetween(from, to)) {

            collection.push(this.collection[i]);
            lastEndTime = this.collection[i].data.end_date;
        }
    }

    // add preprocessedCollection
    if (i>0) {
        this.preprocessedCollection = collection;
    }

    // load additional broadcasts if last match starts before endtime exceeds
    if (lastEndTime < to) {

        this.getResource()
            .setUrl({
                "from" : lastEndTime,
                "to" : to
            })
            .load({
                "url" : 'broadcastsHourly',
                "callback" : $.proxy(this.processCollection, this)
            });
    } else {

        this.currentResult = collection;
        this.preprocessedCollection = undefined;
        this.triggerCollectionLoaded();

    }
};

/**
 * retrieve broadcast resource model
 * @returns {VDRest.Epg.Model.Channels.Channel.Broadcast.Resource}
 */
VDRest.Epg.Model.Channels.Channel.prototype.getResource = function () {

    return this.module.getResource(this.collectionItemModel, {

        /** add identifier and this to resource */
        "channelId":this.getData('channel_id'),
        "channel" : this

    });
};

/**
 * callback
 */
VDRest.Epg.Model.Channels.Channel.prototype.afterCollectionLoaded = function () {
//    console.log(this);
};

