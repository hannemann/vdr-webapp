
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
 * @param {{events: Array.<broadcastData>, count: number, total:number}} result
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

    var i = 0, l = this.collection.length, cur,
        d=new Date(),
        now = d.getTime()/1000,
        end;

    if (l > 0 && (this.collection[l-1].getData('end_time') <= now || this.collection[0].getData('start_time') > now)) {

        end = new Date(this.collection[0].getData('start_date').getTime() - 1);
    } else if (l === 0) {
        end = new Date(Date.now() + 3600 * 6 * 1000);
    }

    $window.one('broadcastsloaded', function (e) {

        var found = false;
        if (e.payload !== this.getData('channel_id')) {
            return;
        }
        l = this.collection.length;
        for (i; i < l; i++) {
            cur = this.collection[i];

            if (cur.getData('start_time') <= now && cur.getData('end_time') >= now) {
                found = true;
                callback(cur);
            }
        }
        if (!found) {
            callback(false);
        }
    }.bind(this));

    this.getByTime(d, end);
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
