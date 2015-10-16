/**
 * @typedef {{}} channelData
 * @property {string} channel_id
 * @property {string} group - groupname channel belongs to
 * @property {string} image - url of channel logo
 * @property {boolean} is_atsc
 * @property {boolean} is_cable
 * @property {boolean} is_sat
 * @property {boolean} is_terr
 * @property {boolean} is_radio
 * @property {string} name
 * @property {number} number
 * @property {string} stream - filename of stream
 * @property {number} transponder
 */

/**
 * Channel Model
 * @class
 * @constructor
 * @property {channelData} data
 * @property {VDRest.Epg.Model.Channels.Channel.Broadcast[]} collection
 * @property {VDRest.Epg.Model.Channels.Channel.Broadcast[]} currentResult
 * @property {VDRest.Epg.Model.Channels.Channel.Broadcast[]|undefined} preprocessedCollection
 * @property {string} baseUrl
 * @property {Object.<string, Object.<string, string>>} events
 * @property {Object.<number, boolean>} loadedNextFrom holds timestamps that have already been requested
 * @property {number|undefined} loadNextFrom
 * @property {VDRest.Epg} module
 * @property {function} currentBroadcastHandler
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
 */
VDRest.Epg.Model.Channels.Channel.prototype.init = function () {

    var channelId = this.getData('channel_id');

    this.collection = [];
    this.currentResult = [];
    this.getFromDate();
    this.events = {
        // event to be triggered when collection is loaded
        "collectionloaded": {
            "type": "broadcastsloaded",
            "payload": channelId
        }
    };

    this.baseUrl = this.module.getResource('Channels.Channel').getBaseUrl();

    // add image url if image is true
    if (this.getData('image')) {

        this.setData('image', this.baseUrl + 'channels/image/' + channelId);
    }

    this.loadedNextFrom = {};
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
 * @param {number|Date} [to]
 */
VDRest.Epg.Model.Channels.Channel.prototype.getNextBroadcasts = function (to) {

    var from = this.collection.length > 0
            ? this.collection[this.collection.length-1].data.end_date
            : this.getFromDate();

    this.loadNextFrom = from.getTime();

    if (this.loadedNextFrom[this.loadNextFrom]) return;

    this.getResource()
        .setUrl(from, to)
        .load({
            "url" : 'broadcastsHourly',
            "callback": this.processCollection.bind(this)
        });
};

/**
 * mark from timestamp as loaded
 * @param {broadcastsResult} result
 */
VDRest.Epg.Model.Channels.Channel.prototype.processCollection = function (result) {

    if (result.count > 0) {

        if (this.loadNextFrom) {
            this.loadedNextFrom[this.loadNextFrom] = true;
        }
        this.loadNextFrom = undefined;
    }
    VDRest.Abstract.Model.prototype.processCollection.call(this, result);
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

    // search in collection for broadcasts that match from and to arguments
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
            .setUrl(lastEndTime, to)
            .load({
                "url": 'broadcastsHourly',
                "callback": this.processCollection.bind(this)
            });
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
            "callback": this.processCollection.bind(this)
        });
};

/**
 * fetch all remaining events
 */
VDRest.Epg.Model.Channels.Channel.prototype.getOneDay = function () {

    var from = this.collection.length > 0
        ? this.collection[this.collection.length-1].data.end_date
        : this.getFromDate();

    this.getResource()
        .setUrl(from, new Date(from.getTime() + 1000 * 60 * 60 * 24))
        .load({
            "url" : 'broadcastsHourly',
            "callback": this.processCollection.bind(this)
        });
};

/**
 * fetch all remaining events
 */
VDRest.Epg.Model.Channels.Channel.prototype.getCurrent = function () {

    this.getResource()
        .load({
            "url" : 'current',
            "callback": this.processCollection.bind(this)
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
 * @param {Function} callback
 * @returns {VDRest.Epg.Model.Channels.Channel.Broadcast|Boolean}
 */
VDRest.Epg.Model.Channels.Channel.prototype.getCurrentBroadcast = function (callback) {

    var l = this.collection.length,
        d=new Date(),
        now = d.getTime()/1000,
        end;

    if (l > 0 && (this.collection[l-1].getData('end_time') <= now || this.collection[0].getData('start_time') > now)) {

        end = new Date(this.collection[0].getData('start_date').getTime() - 1);
    } else if (l === 0) {
        end = new Date(Date.now() + 3600 * 6 * 1000);
    }

    this.currentBroadcastHandler = this.handleCurrentBroadcastResponse.bind(this, callback);

    $window.on('broadcastsloaded', this.currentBroadcastHandler);

    this.getByTime(d, end);
};

/**
 * callback for getCurrentBroadcast listener
 * @param {function} callback
 * @param {jQuery.Event} e
 * @param {string} e.payload
 */
VDRest.Epg.Model.Channels.Channel.prototype.handleCurrentBroadcastResponse = function (callback, e) {

    var found = false, i = 0, l = this.collection.length, cur, now = Date.now()/1000;

    if (e.payload !== this.getData('channel_id')) {
        return;
    }

    for (i; i < l; i++) {
        cur = this.collection[i];

        if (!found && cur.getData('start_time') <= now && cur.getData('end_time') >= now) {
            found = true;
            callback(cur);
            $window.off('broadcastsloaded', this.currentBroadcastHandler);
            break;
        }
    }
    if (!found) {
        callback(false);
    }
};

/**
 * callback
 */
VDRest.Epg.Model.Channels.Channel.prototype.afterCollectionLoaded = function () {

    this.collection.sort(function (a, b) {

        return a.data.start_time - b.data.start_time;
    });
};

VDRest.Epg.Model.Channels.Channel.prototype.cleanCollection = function () {

    while (
    this.collection.length > 0 &&
    this.collection[0].data.end_date.getTime() < this.module[VDRest.config.getItem('lastEpg')].getTime()) {
        this.collection.shift();
    }
};
