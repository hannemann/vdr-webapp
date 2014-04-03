Epg.Model.Channels.Channel.Resource = function () {};

Epg.Model.Channels.Channel.Resource.prototype = new Rest();

Epg.Model.Channels.Channel.Resource.prototype.identifier = 'channelId';

Epg.Model.Channels.Channel.Resource.prototype.init = function () {

    this.baseUrl = "events/" + this.data.channelId + ".json?";
    this.urls = {};
};

Epg.Model.Channels.Channel.Resource.prototype.setHourlyUrl = function () {

    this.urls.broadcastsHourly =  this.baseUrl + this.getHourlyParameter();

    return this;
};

Epg.Model.Channels.Channel.Resource.prototype.getHourlyParameter = function () {

    return "from=" + parseInt(helper.now().getTime() / 1000)
        + "&start=0"
        + "&timespan=" + 60 * 60
}
