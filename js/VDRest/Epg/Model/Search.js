/**
 * @class
 * @constructor
 */
VDRest.Epg.Model.Search = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Epg.Model.Search.prototype = new VDRest.Abstract.Model();

/**
 * classpath of model that holds a single broadcast in collection
 * @type {string}
 */
VDRest.Epg.Model.Search.prototype.collectionItemModel = 'Channels.Channel.Broadcast';

/**
 * name of collection in ajax result
 * @type {string}
 */
VDRest.Epg.Model.Search.prototype.resultCollection = 'events';

/**
 * init collection
 */
VDRest.Epg.Model.Search.prototype.init = function () {

    this.collection = [];
    this.currentResult = [];

    this.events = {
        // event to be triggered when collection is loaded
        "collectionloaded" : 'epgsearchcomplete'
    };
};

/**
 * perform search request
 */
VDRest.Epg.Model.Search.prototype.send = function (options) {

    if (!options.query) {

        throw new Error('EPG search query not set.');
    }

    this.flushCollection();

    this.getResource().load({
        "url" : "search",
        "method" : "POST",
        "data" : {
            "query" : options.query,
            "mode" : options.mode || 0,
            "channelid" : options.channelid || null,
            "use_title" : options.use_title || true,
            "use_subtitle" : options.use_subtitle || false,
            "use_description" : options.use_description || false
        },
        "callback" : $.proxy(this.processCollection, this)
    });
};

/**
 * retrieve broadcast resource model
 * @returns {VDRest.Epg.Model.Search.Resource}
 */
VDRest.Epg.Model.Search.prototype.getResource = function () {

    return this.module.getResource('Search');
};