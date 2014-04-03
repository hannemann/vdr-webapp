Epg.Model.Resource = function () {};

Epg.Model.Resource.prototype = new Rest();

Epg.Model.Resource.prototype.urls = {
//    "broadcastsHourly" : "/events/" + channelId + ".json?from=" + parseInt(from.getTime() / 1000) + "&start=0&timespan=" + 60 * 60,
    "channelList" : "channels/.json"
};

//Epg.Model.Resource.prototype.load = function (id) {
//
//
//};