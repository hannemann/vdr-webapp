/**
 * Broadcasts resource model
 * @constructor
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.Resource = function () {};

/**
 * @type {VDRest.Rest.Api}
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.Resource.prototype = new VDRest.Rest.Api();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.Resource.prototype._class = 'VDRest.Epg.Model.Channels.Channel.Broadcast.Resource';

/**
 * key of model in cache
 * @type {string}
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.Resource.prototype.cacheKey = 'channelId';

/**
 * number of seconds to add to starting point of time if broadcasts are loaded
 * @type {number}
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.Resource.prototype.defaultTimeSpan = 3 * 60 * 60 * 1000;

/**
 * @member {string} baseUrl
 * @member {object} urls
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.Resource.prototype.init = function () {

    this.baseUrl = "events/" + this.data.channelId + ".json?";
    this.urls = {};
};

/**
 * set url to retrieve broadcasts
 * in the hour after latest stored broadcast
 *
 * @param {Date} from
 * @param {Date} [to]
 * @returns {VDRest.Epg.Model.Channels.Channel.Broadcast.Resource}
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.Resource.prototype.setUrl = function (from, to) {

    /** @type {number} */
    var timeSpan,

        /** @type {number} */
        _from;

    /** @type {number} */
    _from = parseInt(from.getTime()/1000, 10);

    /** @type {Date} */
    to = to || new Date(from.getTime() + this.defaultTimeSpan);

    timeSpan = parseInt( ( to.getTime() - from.getTime() ) / 1000, 10 );

    this.urls.broadcastsHourly =  this.baseUrl
        + "from=" + _from
        + "&start=0"
        + "&timespan=" + timeSpan;

    return this;
};


