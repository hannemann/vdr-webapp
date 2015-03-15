/**
 * @class
 * @constructor
 */
Gui.Window.ViewModel.Broadcast = function () {};

/**
 * @type {VDRest.Lib.Cache.store.ViewModel}
 */
Gui.Window.ViewModel.Broadcast.prototype = new VDRest.Abstract.ViewModel();

/**
 * cache key
 * @type {string}
 */
Gui.Window.ViewModel.Broadcast.prototype.cacheKey = 'channel/id';

/**
 * map strings to images
 * @type {object}
 * @property {string} 16:9
 * @property {string} stereo
 */
Gui.Window.ViewModel.Broadcast.prototype.componentsMap = {
    "16:9":'<img src="' + VDRest.image.getComponent('16:9') + '" alt="">',
    "stereo":'<img src="' + VDRest.image.getComponent('stereo') + '" alt="">'
};

/**
 * init view methods
 */
Gui.Window.ViewModel.Broadcast.prototype.init = function () {

    var me = this;

    this.resource = this.data.resource.data;
    this.view = this.data.view;

    this.baseUrl = VDRest.Api.Resource.prototype.getBaseUrl();

    this.initViewMethods();

    this.view.getStartTime = function () {

        return VDRest.helper.getTimeString(me.resource.start_date)
    };

    this.view.getEndTime = function () {

        return VDRest.helper.getTimeString(me.resource.end_date)
    };

    this.view.hasComponents = function () {

        return me.resource.components.length > 0;
    };

    this.view.getComponents = function () {

        return me.getComponents();
    };

    this.view.getEpgImage = this.getEpgImage.bind(this);

    this.view.getEpisodeImage = this.getEpisodeImage.bind(this);

    this.view.getFanart = this.getFanart.bind(this);
};

/**
 * map components to images
 * @returns {Array}
 */
Gui.Window.ViewModel.Broadcast.prototype.getComponents = function () {

    var i = 0, l = this.resource.components.length, components, component;

    if (l > 0) {

        components = [];

        for (i;i<l;i++) {

            component = this.componentsMap[this.resource.components[i].description.toLowerCase()];
            if (typeof component != 'undefined') {

                components.push(component);
            }
        }
    }

    return components.unique();
};

/**
 * retrieve epg image
 * @returns {String|Boolean}
 */
Gui.Window.ViewModel.Broadcast.prototype.getEpgImage = function () {

    var images = this.data.resource.getData('images');

    if (images && images.length > 0) {
        return images[0];
    }

    return false;
};

/**
 * retrieve fanart
 * @param {Number} width
 * @returns {String|Boolean}
 */
Gui.Window.ViewModel.Broadcast.prototype.getFanart = function (width) {

    /**
     * @type {additionalMediaEpisode|additionalMediaMovie}
     */
    var media = this.data.resource.getData('additional_media'),
        resize = '';

    if (media) {

        if (width) {
            resize = 'width/' + width + '/';
        }

        if ('series' === media.type) {

            if (media.fanarts.length > 0) {
                return this.baseUrl + 'scraper/image/' + resize + media.fanarts[0].path;
            }
        } else if ('movie' === media.type) {

            if (media.fanart) {
                return this.baseUrl + 'scraper/image/' + resize + media.fanart;
            }
        }
    }
    return false;
};

/**
 * retrieve episode image
 * @param {Number} width
 * @returns {String|Boolean}
 */
Gui.Window.ViewModel.Broadcast.prototype.getEpisodeImage = function (width) {

    /**
     * @type {additionalMediaEpisode|additionalMediaMovie}
     */
    var media = this.data.resource.getData('additional_media'),
        resize = '';

    if (media) {

        if (width) {
            resize = 'width/' + width + '/';
        }

        if ('series' === media.type) {

            if (media.episode_image) {
                return this.baseUrl + 'scraper/image/' + resize + media.episode_image;
            }
        }
    }
    return false;
};
