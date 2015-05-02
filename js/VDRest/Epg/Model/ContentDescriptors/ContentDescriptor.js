/**
 * Channel ViewModel
 * @class
 * @constructor
 * @var {object} data
 * @property {string} id
 * @property {string} name
 *
 * @var {object} events
 * @property {string} collectionloaded
 */
VDRest.Epg.Model.ContentDescriptors.ContentDescriptor = function () {
};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Epg.Model.ContentDescriptors.ContentDescriptor.prototype = new VDRest.Abstract.Model();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Epg.Model.ContentDescriptors.ContentDescriptor.prototype._class = 'VDRest.Epg.Model.ContentDescriptors.ContentDescriptor';

/**
 * identifier in result object
 * overrides default
 * @type {string}
 */
VDRest.Epg.Model.ContentDescriptors.ContentDescriptor.prototype.cacheKey = 'id';
