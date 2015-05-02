/**
 * @class
 * @constructor
 */
VDRest.Epg.Model.ContentDescriptors = function () {
};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Epg.Model.ContentDescriptors.prototype = new VDRest.Abstract.Model();

/**
 * name of collection object in result
 * @type {string}
 */
VDRest.Epg.Model.ContentDescriptors.prototype.resultCollection = 'content_descriptors';

/**
 * name of collection item model
 * @type {string}
 */
VDRest.Epg.Model.ContentDescriptors.prototype.collectionItemModel = 'ContentDescriptors.ContentDescriptor';

/**
 * event to trigger when collection is loaded
 * @type {{collectionloaded: string}}
 */
VDRest.Epg.Model.ContentDescriptors.prototype.events = {

    "collectionloaded": 'contentdescriptorsloaded'
};

/**
 * @member {object} collection  store for channel models
 * @member {number} data.count  number of currently stored channel objects
 */
VDRest.Epg.Model.ContentDescriptors.prototype.init = function () {

    this.collection = [];
    this.currentResult = [];
};

/**
 * load initial broadcasts
 */
VDRest.Epg.Model.ContentDescriptors.prototype.initContentDescriptors = function () {

    var resource = this.module.getResource('ContentDescriptors');

    resource
        .load({
            "url": "initial",
            "callback": this.processCollection.bind(this)
        });
};
