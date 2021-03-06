/**
 * @class
 * @constructor
 *
 * @var {object] resource
 * @property {string} channel_id
 * @property {string} group - groupname channel belongs to
 * @property {string} image - url of channel logo
 * @property {boolean} is_atsc
 * @property {boolean} is_cable
 * @property {boolean} is_sat
 * @property {boolean} is_terr
 * @property {string} name
 * @property {number} number
 * @property {string} stream - filename of stream
 * @property {number} transponder
 */
Gui.Epg.ViewModel.Channels.Channel = function () {};

/**
 * @type {VDRest.Abstract.ViewModel}
 */
Gui.Epg.ViewModel.Channels.Channel.prototype = new VDRest.Abstract.ViewModel();

/**
 * @type {string}
 */
Gui.Epg.ViewModel.Channels.Channel.prototype.cacheKey = 'channel_id';

/**
 * initialize
 */
Gui.Epg.ViewModel.Channels.Channel.prototype.init = function () {

    this.initViewMethods();
};
