/**
 * Broadcasts resource model
 * @constructor
 */
VDRest.Epg.Model.Channels.Channel.Resource = function () {};

/**
 * @type {VDRest.Rest.Api}
 */
VDRest.Epg.Model.Channels.Channel.Resource.prototype = new VDRest.Rest.Api();

/**
 * key of model in cache
 * @type {string}
 */
VDRest.Epg.Model.Channels.Channel.Resource.prototype.identifier = 'channelId';

/**
 * @member {string} baseUrl
 * @member {object} urls
 */
VDRest.Epg.Model.Channels.Channel.Resource.prototype.init = function () {

    this.baseUrl = "events/" + this.data.channelId + ".json?";
    this.urls = {};
};

/**
 * set url to retrieve broadcasts
 * in the hour after latest stored broadcast
 *
 * @param {object} parameter
 * @returns {VDRest.Epg.Model.Channels.Channel.Resource}
 */
VDRest.Epg.Model.Channels.Channel.Resource.prototype.setUrl = function (parameter) {

    this.urls.broadcastsHourly =  this.baseUrl
        + "from=" + parameter.from
        + "&start=0"
        + "&timespan=" + 60 * 60;

    return this;
};

