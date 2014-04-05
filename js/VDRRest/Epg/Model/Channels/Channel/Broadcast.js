
/**
 * @typedef data
 * @type {object}
 * @property {string} channel_name  channel_name
 * @property {Array} components     stream descriptions
 * @property {Array} contents
 * @property {string} description
 * @property {Array} details
 * @property {number} duration
 * @property {number} id
 * @property {number} images        number of epg images
 * @property {number} parental_rating
 * @property {Array} raw_contents   ???
 * @property {string} short_text    short description, subtitle
 * @property {number} table_id      ???
 * @property {boolean} timer_active
 * @property {boolean} timer_exists
 * @property {number} timer_id
 * @property {string} title
 * @property {number} version
 * @property {number} vps           timestamp
 * @property {number} start_time    timestamp
 * @property {number} end_time      timestamp
 * @property {Date} start_date
 * @property {Date} end_date
 * @property {VDRest.Epg.Model.Channels.Channel} channel
 */

/**
 * Broadcast data model
 * @class
 * @member {.data} this.data
 * @constructor
 */
VDRest.Epg.Model.Channels.Channel.Broadcast = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Epg.Model.Channels.Channel.Broadcast.prototype = new VDRest.Abstract.Model();

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

    var i = 0, l = this.data.images;
    if (i < l) {

        this.data.images = [];
        for (i;i<l;i++) {

            this.data.images.push(this.data.channel.baseUrl + 'events/image/' + this.data.id + '/' + i);
        }
    }
};


