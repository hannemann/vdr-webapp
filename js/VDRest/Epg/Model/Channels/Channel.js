
/**
 * Channel ViewModel
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
 * class name
 * @type {string}
 * @private
 */
VDRest.Epg.Model.Channels.Channel.prototype._class = 'VDRest.Epg.Model.Channels.Channel';

/**
 * identifier in result object
 * overrides default
 * @type {string}
 */
VDRest.Epg.Model.Channels.Channel.prototype.cacheKey = 'channel_id';

/**
 * indicates if object cache entry can be invalidated
 * @type {boolean}
 */
VDRest.Epg.Model.Channels.Channel.prototype.canInvalidate = false;

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
 * @type {string}
 */
VDRest.Epg.Model.Channels.Channel.prototype.resultJSON = 'channels';

/**
 * name of property that holds parent object
 * @type {string}
 */
VDRest.Epg.Model.Channels.Channel.prototype.mixIntoCollectionItem = 'channelObj';
/**
 * initialize collection cache
 * do some data transformations
 * @member {object} collection holds collection items VDRest.Epg.ViewModel.Channels.Channel.Broadcast
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

/**
 * retrieve date object of chosen EPG start time
 * @returns {*}
 */
VDRest.Epg.Model.Channels.Channel.prototype.getFromDate = function () {

    return this.module[VDRest.config.getItem('lastEpg')];
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
        .setUrl(from)
        .load({
            "url" : 'broadcastsHourly',
            "callback" : $.proxy(this.processCollection, this)
        });
};

/**
 * retrieve Broadcast models from point of time
 * @param {Date} from - Date object start
 * @param {Date} [to] - Date object end
 * @param {Boolean} [async] - load asynchronous
 */
VDRest.Epg.Model.Channels.Channel.prototype.getByTime = function (from, to, async) {

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
        broadcast,

        data;

    async = async !== false;

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

        data = {
            "url" : 'broadcastsHourly',
            "async" : async
        };

        if (async) {
            data.callback = $.proxy(this.processCollection, this);
        }

        data = this.getResource()
            .setUrl(lastEndTime, to)
            .load(data);

        if (!async) {

            if (data.responseJSON && data.responseJSON[this.resultCollection]) {
                this.processCollection(data.responseJSON);
                this.triggerCollectionLoaded();
            }
        }
    } else {

        this.currentResult = collection;
        this.preprocessedCollection = undefined;
        this.triggerCollectionLoaded();

    }
};

/**
 * fetch all remaining events
 */
VDRest.Epg.Model.Channels.Channel.prototype.getAllRemaining = function () {

    var from = this.collection.length > 0
        ? this.collection[this.collection.length-1].data.end_date
        : this.getFromDate();

    this.getResource()
        .setUrl(from, 0)
        .load({
            "url" : 'broadcastsHourly',
            "callback" : $.proxy(this.processCollection, this)
        });
};

/**
 * fetch all remaining events
 * @param {Boolean} [async]
 */
VDRest.Epg.Model.Channels.Channel.prototype.getOneDay = function (async) {

    var from = this.collection.length > 0
        ? this.collection[this.collection.length-1].data.end_date
        : this.getFromDate();

    async = "undefined" === typeof async ? true : async;

    this.getResource()
        .setUrl(from, new Date(from.getTime() + 1000 * 60 * 60 * 24))
        .load({
            "async" : async,
            "url" : 'broadcastsHourly',
            "callback" : $.proxy(this.processCollection, this)
        });
};

/**
 * retrieve broadcast resource model
 * @returns {VDRest.Epg.Model.Channels.Channel.Broadcast.Resource}
 */
VDRest.Epg.Model.Channels.Channel.prototype.getResource = function () {

    return this.module.getResource(this.collectionItemModel, {

        /** add identifier to resource */
        "channel_id":this.getData('channel_id')

    });
};

/**
 * retrieve streamurl
 * @param {Array} [streamdevParams]
 * @returns {string}
 */
VDRest.Epg.Model.Channels.Channel.prototype.getStreamUrl = function (streamdevParams) {

    return this.helper().getBaseStreamUrl(streamdevParams) + this.data.stream;
};

/**
 * retrieve current broadcast
 * @returns {VDRest.Epg.Model.Channels.Channel.Broadcast|Boolean}
 */
VDRest.Epg.Model.Channels.Channel.prototype.getCurrentBroadcast = function () {

    var i = 0, l = this.collection.length, now = new Date().getTime()/1000, cur;

    if (l > 0 && this.collection[l-1].getData('end_time') <= now) {

        this.getOneDay(false);
    }

    for (i;i<l;i++) {
        cur = this.collection[i];

        if (cur.getData('start_time') <= now && cur.getData('end_time') >= now) {
            return cur;
        }
    }
    return false;
};

/**
 * callback
 */
VDRest.Epg.Model.Channels.Channel.prototype.afterCollectionLoaded = function () {
//    console.log(this);
};

