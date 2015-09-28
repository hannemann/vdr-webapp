/**
 * @typedef {{}} broadcastData
 * @property {string} channel           channel_name
 * @property {VDRest.Epg.Model.Channels.Channel} channelObj           channel_name
 * @property {string} channel_name      channel_name
 * @property {Array.<component>} components         stream descriptions
 * @property {Array} contents
 * @property {string} description
 * @property {Array} details
 * @property {Number} duration
 * @property {Number} id
 * @property {Number} images            number of epg images
 * @property {Number} parental_rating
 * @property {Array} raw_contents       ???
 * @property {string} short_text        short description, subtitle
 * @property {Number} table_id          ???
 * @property {boolean} timer_active
 * @property {boolean} timer_exists
 * @property {string} timer_id
 * @property {string} title
 * @property {Number} version
 * @property {Number} vps               timestamp
 * @property {Number} start_time        timestamp
 * @property {Number} end_time          timestamp
 * @property {Date} start_date
 * @property {Date} end_date
 */

/**
 * @typedef {{}} component
 * @property {String} description
 * @property {String} language
 * @property {Number} stream
 * @property {Number} type
 */

/**
 * @typedef {{}} actor
 * @property {String} name
 * @property {String} role
 * @property {String} thumb
 */

/**
 * @typedef {{}} banners
 * @property {Number} width
 * @property {Number} height
 * @property {String} path
 */
/**
 * @typedef {{}} fanarts
 * @property {Number} width
 * @property {Number} height
 * @property {String} path
 */
/**
 * @typedef {{}} posters
 * @property {Number} width
 * @property {Number} height
 * @property {String} path
 */

/**
 * @typedef {{}} additionalMediaMovie
 *
 * @property {Array.<actor>} actors
 * @property {Boolean} adult
 * @property {String} collection_fanart
 * @property {String} collection_name
 * @property {String} collection_poster
 * @property {String} fanart
 * @property {String} genres
 * @property {String} homepage
 * @property {Number} movie_id
 * @property {String} original_title
 * @property {String} overview
 * @property {Number} popularity
 * @property {String} poster
 * @property {String} release_date
 * @property {Number} revenue
 * @property {Number} runtime
 * @property {String} tagline
 * @property {String} title
 * @property {String} type
 * @property {Number} vote_average
 */

/**
 * @typedef {{}} additionalMediaEpisode
 * @property {Array.<banners>} banners
 * @property {String} episode_first_aired
 * @property {String} episode_guest_stars
 * @property {Number} episode_id
 * @property {String} episode_image
 * @property {String} episode_name
 * @property {Number} episode_number
 * @property {String} episode_overview
 * @property {Number} episode_rating
 * @property {Number} episode_season
 * @property {Array.<fanarts>} fanarts
 * @property {String} first_aired
 * @property {String} genre
 * @property {String} name
 * @property {String} network
 * @property {String} overview
 * @property {Array.<posters>} posters
 * @property {Number} rating
 * @property {Number} series_id
 * @property {String} status
 * @property {String} type
 *
 */

/**
 * Broadcast data model
 * @class
 * @constructor
 * @property {broadcastData} data
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

    if (this.data.timer_id) {

        this.module.getModel('Observer').registerTimer(this);
    }
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

        baseUrl = VDRest.Api.Resource.prototype.getBaseUrl();
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


