/**
 * @class
 * @constructor
 * @property {VDRest.Epg.Model.Channels.Channel.Broadcast[]} collection
 * @property {VDRest.Epg.Model.Channels.Channel.Broadcast[]} currentResult
 */
VDRest.Epg.Model.Overview = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Epg.Model.Overview.prototype = new VDRest.Abstract.Model();

/**
 * classpath of model that holds a single broadcast in collection
 * @type {string}
 */
VDRest.Epg.Model.Overview.prototype.collectionItemModel = 'Channels.Channel.Broadcast';

/**
 * name of collection in ajax result
 * @type {string}
 */
VDRest.Epg.Model.Overview.prototype.resultCollection = 'events';

/**
 * init collection
 */
VDRest.Epg.Model.Overview.prototype.init = function () {

    this.collection = [];
    this.currentResult = [];

    this.events = {
        "collectionloaded" : 'overviewloaded'
    };
};

/**
 * @param {number} [date_limit]
 */
VDRest.Epg.Model.Overview.prototype.load = function (date_limit) {

    var searchParams = {
            "search" : this.getSearchRegex(),
            "mode" : 4,
            "use_title" : false,
            "use_subtitle" : false,
            "use_description" : true
        },
        channelGroup = this.getChannelGroup(),
        resource = this.getResource(),
        search = VDRest.SearchTimer.Model.List.SearchTimer.prototype.getInitData(), i;

    if (channelGroup.length > 0) {
        searchParams.use_channel = 2;
        searchParams.channels = channelGroup
    }

    date_limit = date_limit || this.getTodayDateLimit();
    this.flushCollection();
    resource.urls.search = resource.baseSearchUrl + date_limit.toString();

    for (i in searchParams) {
        if (searchParams.hasOwnProperty(i) && search.hasOwnProperty(i)) {
            search[i] = searchParams[i];
        }
    }

    resource.load({
        "url" : "search",
        "method" : "POST",
        "data" : search,
        "callback" : this.processCollection.bind(this)
    });
};

/**
 * retrieve overview resource model
 * @returns {VDRest.Epg.Model.Overview.Resource}
 */
VDRest.Epg.Model.Overview.prototype.getResource = function () {

    return this.module.getResource('Overview');
};

/**
 * @return {number}
 */
VDRest.Epg.Model.Overview.prototype.getTodayDateLimit = function () {

    var t = new Date(),
        s = new Date(t.getFullYear().toString() + '-' + (t.getMonth() + 1).toString() + '-' + t.getDate().toString());

    s.setDate(s.getDate() + 1);
    return s.getTime() / 1000;
};

/**
 * @return {string}
 */
VDRest.Epg.Model.Overview.prototype.getSearchRegex = function () {

    return "Kategorie: (Information|Spielfilm|Serie|Show|Sport).*((top|tages|)tipp|\\*{4,})";
};

/**
 * @return {string}
 */
VDRest.Epg.Model.Overview.prototype.getChannelGroup = function () {

    return "Overview";
};
