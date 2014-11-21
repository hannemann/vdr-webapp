/**
 * @class
 * @constructor
 */
VDRest.Database.Model.Shows.Show = function () {};

/**
 * @type {VDRest.Abstract.IndexedDB.Item}
 */
VDRest.Database.Model.Shows.Show.prototype = new VDRest.Database.Model.Item();

/**
 * @type {String}
 */
VDRest.Database.Model.Shows.Show.prototype.cacheKey = "series_id";

/**
 * @type {String}
 */
VDRest.Database.Model.Shows.Show.prototype.primaryKey = "series_id";

/**
 * object store name
 * @type {string}
 */
VDRest.Database.Model.Shows.Show.prototype.oStore = 'shows';

/**
 * add episode to show
 * @param {Object} media
 */
VDRest.Database.Model.Shows.Show.prototype.addEpisode = function (media) {

    if (media.episode_season && media.episode_number) {

        if (!this.data.episodes.seasons[media.episode_season]) {
            this.data.episodes.seasons[media.episode_season] = {};
        }
        this.data.episodes.seasons[media.episode_season][media.episode_number] = media.episode_id;
    }
};

/**
 * initialize data object
 * @param {Object} media
 * @returns {{}}
 */
VDRest.Database.Model.Shows.Show.prototype.initMedia = function (media) {

    var series_data = {}, i;

    for (i in media) {
        if (media.hasOwnProperty(i)) {
            if (i.indexOf('episode') > -1) continue;
            series_data[i] = media[i];
        }
    }
    series_data.episodes = {
        "seasons":{}
    };

    return series_data;
};
