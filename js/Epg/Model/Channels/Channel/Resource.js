Epg.Model.Channels.Channel.Resource = function () {};

Epg.Model.Channels.Channel.Resource.prototype = new Rest();

Epg.Model.Channels.Channel.Resource.prototype.setUrl = function (channelId) {

    this.urls = {
        "broadcastsHourly" : "events/"
            + channelId
            + ".json?from="
            + parseInt(helper.now().getTime() / 1000)
            + "&start=0&timespan=" + 60 * 60
    };

    return this;
};
