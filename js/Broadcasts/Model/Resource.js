Broadcasts.Model.Resource = function () {};

Broadcasts.Model.Resource.prototype = new Rest();

Broadcasts.Model.Resource.prototype.urls = {
//    "broadcastsHourly" : "/events/" + channelId + ".json?from=" + parseInt(from.getTime() / 1000) + "&start=0&timespan=" + 60 * 60,
    "channelList" : "channels/.json"
};

//Broadcasts.Model.Resource.prototype.load = function (id) {
//
//
//};