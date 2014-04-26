
/**
 * Broadcast data model
 * @class
 * @constructor
 * @var {object} data
 * @property {string} channel           channel_name
 * @property {VDRest.Epg.Model.Channels.Channel} channelObj           channel_name
 * @property {string} channel_name      channel_name
 * @property {Array} components         stream descriptions
 * @property {Array} contents
 * @property {string} description
 * @property {Array} details
 * @property {number} duration
 * @property {number} id
 * @property {number} images            number of epg images
 * @property {number} parental_rating
 * @property {Array} raw_contents       ???
 * @property {string} short_text        short description, subtitle
 * @property {number} table_id          ???
 * @property {boolean} timer_active
 * @property {boolean} timer_exists
 * @property {number} timer_id
 * @property {string} title
 * @property {number} version
 * @property {number} vps               timestamp
 * @property {number} start_time        timestamp
 * @property {number} end_time          timestamp
 * @property {Date} start_date
 * @property {Date} end_date
 */
VDRest.Epg.Model.Channels.Channel.Broadcast = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.prototype = new VDRest.Abstract.Model();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.prototype._class = 'VDRest.Epg.Model.Channels.Channel.Broadcast';

/**
 * @type {string}
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.prototype.cacheKey = 'channel/id';

/**
 * @type {string}
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.prototype.resultJSON = 'events';

/**
 * indicates if object cache entry can be invalidated
 * @type {boolean}
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.prototype.canInvalidate = true;

/**
 * initialize broadcast
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.prototype.init = function () {

    this.setDates();
    this.setImages();
};

/**
 * init date objects
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.prototype.setDates = function () {

    this.data.start_date = new Date((this.data.start_time)*1000);
    this.data.end_date = new Date((this.data.start_time + this.data.duration)*1000);
    this.data.end_time = this.data.start_time + this.data.duration;

    if ( this.data.end_date > this.data.channel.from ) {

        this.data.channel.from = this.data.end_date;
    }
};

/**
 * init image array
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.prototype.setImages = function () {

    var i = 0, l = this.data.images, baseUrl;
    if (i < l) {

        baseUrl = VDRest.Rest.Api.prototype.getBaseUrl();
        this.data.images = [];
        for (i;i<l;i++) {

            this.data.images.push(baseUrl + 'events/image/' + this.data.id + '/' + i);
        }
    }
};

/**
 * determine if broadcast starts before given time
 * @param {Date} time
 * @returns {boolean}
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.prototype.startsBeforeOrAt = function (time) {

    return this.data.start_date <= time;
};

/**
 * determine if broadcast starts before given time
 * @param {Date} time
 * @returns {boolean}
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.prototype.startsAfterOrAt = function (time) {

    return this.data.start_date >= time;
};

/**
 * determine if broadcast ends before given time
 * @param {Date} time
 * @returns {boolean}
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.prototype.endsBeforeOrAt = function (time) {

    return this.data.end_date <= time;
};

/**
 * determine if broadcast ends before given time
 * @param {Date} time
 * @returns {boolean}
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.prototype.endsAfter = function (time) {

    return this.data.end_date >= time;
};

/**
 * determine if broadcast is shown between from and to
 * @param {Date} from
 * @param {Date} to
 * @returns {boolean}
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.prototype.shownBetween = function (from, to) {

    return this.data.start_date <= to && this.data.end_date > from;
};


