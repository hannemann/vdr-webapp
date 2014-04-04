VDRest.Epg.Model.Channels.Channel.Resource = function () {};

VDRest.Epg.Model.Channels.Channel.Resource.prototype = new VDRest.Api();

VDRest.Epg.Model.Channels.Channel.Resource.prototype.identifier = 'channelId';

VDRest.Epg.Model.Channels.Channel.Resource.prototype.init = function () {

    this.baseUrl = "events/" + this.data.channelId + ".json?";
    this.urls = {};
};

VDRest.Epg.Model.Channels.Channel.Resource.prototype.setHourlyUrl = function () {

    this.urls.broadcastsHourly =  this.baseUrl + this.getHourlyParameter();

    return this;
};

VDRest.Epg.Model.Channels.Channel.Resource.prototype.getHourlyParameter = function () {

    return "from=" + parseInt(helper.now().getTime() / 1000)
        + "&start=0"
        + "&timespan=" + 60 * 60
}
