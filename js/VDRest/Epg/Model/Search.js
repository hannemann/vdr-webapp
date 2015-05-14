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

VDRest.Epg.Model.Search.prototype.setIsSearchTimer = function () {

    this.events.collectionloaded = 'gui-searchtimer.perform';
    return this;
};

VDRest.Epg.Model.Search.prototype.unsetIsSearchTimer = function () {

    this.events.collectionloaded = 'epgsearchcomplete';
    return this;
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
            "use_title" : options.use_title !== false,
            "use_subtitle" : options.use_subtitle === true,
            "use_description" : options.use_description === true
        },
        "callback" : this.processCollection.bind(this)
    });
};

/**
 * retrieve broadcast resource model
 * @returns {VDRest.Epg.Model.Search.Resource}
 */
VDRest.Epg.Model.Search.prototype.getResource = function () {

    return this.module.getResource('Search');
};