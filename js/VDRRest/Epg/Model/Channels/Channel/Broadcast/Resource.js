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
 * key of model in cache
 * @type {string}
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.Resource.prototype.identifier = 'channelId';

/**
 * number of seconds to add to starting point of time if broadcasts are loaded
 * @type {number}
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.Resource.prototype.defaultTimeSpan = 60 * 60 * 1000;

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
 * @type {object} parameter
 * @property {Date} from
 * @property {Date} to
 * @returns {VDRest.Epg.Model.Channels.Channel.Broadcast.Resource}
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.Resource.prototype.setUrl = function (parameter) {

    var
        /** @type {number} */
        from = parseInt(parameter.from.getTime()/1000, 10),

        /** @type {Date} */
        to = parameter.to || new Date(parameter.from.getTime() + this.defaultTimeSpan),

        /** @type {number} */
        timeSpan = parseInt( ( to.getTime() - parameter.from.getTime() ) / 1000, 10 );

    this.urls.broadcastsHourly =  this.baseUrl
        + "from=" + from
        + "&start=0"
        + "&timespan=" + timeSpan;

    return this;
};


