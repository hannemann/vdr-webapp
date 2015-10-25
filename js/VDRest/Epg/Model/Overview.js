/**
 * @class
 * @constructor
 * @property {VDRest.Epg.Model.Channels.Channel.Broadcast[]} collection
 * @property {VDRest.Epg.Model.Channels.Channel.Broadcast[]} currentResult
 * @property {VDRest.Epg.Model.Channels.Channel.Broadcast[]} movies
 * @property {VDRest.Epg.Model.Channels.Channel.Broadcast[]} shows
 * @property {VDRest.Epg.Model.Channels.Channel.Broadcast[]} sports
 * @property {VDRest.Epg.Model.Channels.Channel.Broadcast[]} series
 * @property {VDRest.Epg.Model.Channels.Channel.Broadcast[]} info
 * @property {Object.<string, string>} events
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
 * initialize
 */
VDRest.Epg.Model.Overview.prototype.init = function () {

    this.collection = [];
    this.currentResult = [];

    this.movieDescriptor  = 'Kategorie: Spielfilm';
    this.showDescriptor   = 'Kategorie: Show';
    this.infoDescriptor   = 'Kategorie: Information';
    this.seriesDescriptor = 'Kategorie: Serie';
    this.sportsDescriptor = 'Kategorie: Sport';

    this.events = {
        "collectionloaded" : 'overviewloaded',
        "collectionsorted" : "overviewsorted"
    };
};

/**
 * load overview
 */
VDRest.Epg.Model.Overview.prototype.load = function () {

    var resource = this.getResource(),
        options = this.getSearchOptions(),
        dateLimit = this.getDateLimit(options.dateLimit);

    if (!options) {
        return;
    }

    this.flushCollection();
    resource.urls.search = resource.baseSearchUrl + dateLimit.toString();

    resource.load({
        "url" : "search",
        "method" : "POST",
        "data" : this.getSearchOptions(),
        "callback" : this.processCollection.bind(this)
    });
};

/**
 * @param {Object} result
 */
VDRest.Epg.Model.Overview.prototype.processCollection = function (result) {

    VDRest.Abstract.Model.prototype.processCollection.call(this, result);

    this.movies = [];
    this.shows = [];
    this.sports = [];
    this.series = [];
    this.info = [];

    this.collection.forEach(this.sortBroadcast.bind(this));
};

/**
 * @param {VDRest.Epg.Model.Channels.Channel.Broadcast} broadcast
 */
VDRest.Epg.Model.Overview.prototype.sortBroadcast = function (broadcast) {

    if (broadcast.data.description.indexOf(this.movieDescriptor) > -1) {
        this.movies.push(broadcast);
    }
    if (broadcast.data.description.indexOf(this.infoDescriptor) > -1) {
        this.info.push(broadcast);
    }
    if (broadcast.data.description.indexOf(this.seriesDescriptor) > -1) {
        this.series.push(broadcast);
    }
    if (broadcast.data.description.indexOf(this.showDescriptor) > -1) {
        this.shows.push(broadcast);
    }
    if (broadcast.data.description.indexOf(this.sportsDescriptor) > -1) {
        this.sports.push(broadcast);
    }
};
/**
 * retrieve search options object
 * @return {searchTimerData|boolean}
 */
VDRest.Epg.Model.Overview.prototype.getSearchOptions = function () {

    /** @type {VDRest.Epg.Model.Overview.Template} */
    var model = this.module.getModel('Overview.Template');

    if (model.hasTemplate) {
        return JSON.parse(model.getData('search'));
    }
    return false;
};

/**
 * retrieve overview resource model
 * @returns {VDRest.Epg.Model.Overview.Resource}
 */
VDRest.Epg.Model.Overview.prototype.getResource = function () {

    return this.module.getResource('Overview');
};

/**
 * retrieve timestamp of tomorrow 00:00
 * @return {number}
 */
VDRest.Epg.Model.Overview.prototype.getDateLimit = function (plusDays) {

    var t = new Date(),
        s = new Date(t.getFullYear().toString() + '-' + (t.getMonth() + 1).toString() + '-' + t.getDate().toString());

    plusDays = plusDays || 0;

    s.setDate(s.getDate() + 1 + plusDays);
    return s.getTime() / 1000;
};
