/**
 * Broadcasts resource model
 * @constructor
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.Resource = function () {};

/**
 * @type {VDRest.Api.Resource}
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.Resource.prototype = new VDRest.Api.Resource();

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
VDRest.Epg.Model.Channels.Channel.Broadcast.Resource.prototype.cacheKey = 'channel_id';

/**
 * number of seconds to add to starting point of time if broadcasts are loaded
 * @type {number}
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.Resource.prototype.defaultTimeSpan = 6 * 60 * 60 * 1000;

/**
 * @member {string} baseUrl
 * @member {object} urls
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.Resource.prototype.init = function () {

    this.baseUrl = "events/" + this.data.channel_id + ".json?";
    this.urls = {
        "current" : this.baseUrl + 'start=0&limit=1'
    };
};

/**
 * set url to retrieve broadcasts
 *
 * @param {Date} from
 * @param {number|Date} [to]
 * @returns {VDRest.Epg.Model.Channels.Channel.Broadcast.Resource}
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.Resource.prototype.setUrl = function (from, to) {

    /** @type {number} */
    var timeSpan,

        /** @type {number} */
        _from;

    /** @type {number} */
    _from = parseInt(from.getTime()/1000, 10);

    if (to === 0) {

        // 0 fetches all events in the future
        timeSpan = 0;

    } else {

        /** @type {Date} */
        to = to || new Date(
            from.getTime()
            + VDRest.app.getModule('Gui.Epg').getView('Broadcasts').getAvailableTimespan('seconds') * 1000
        );

        timeSpan = parseInt( ( to.getTime() - from.getTime() ) / 1000, 10 );
    }


    this.urls.broadcastsHourly =  this.baseUrl
        + "from=" + _from
        + "&start=0"
        + "&timespan=" + timeSpan;

    return this;
};

/**
 * set id and channel of requested broadcast
 * @param {string} cacheKey
 * @returns {VDRest.Epg.Model.Channels.Channel.Broadcast.Resource}
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.Resource.prototype.setIdUrl = function (cacheKey) {

    var keys = cacheKey.split('/');

    this.urls.byId = 'events/' + keys[0] + '/' + keys[1] + '.json';

    return this;
};
