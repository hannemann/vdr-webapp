/**
 * @class
 * @constructor
 */
Gui.Timer.ViewModel.Window.Timer = function () {};

/**
 * @type {VDRest.Abstract.ViewModel}
 */
Gui.Timer.ViewModel.Window.Timer.prototype = new Gui.Timer.ViewModel.List.Timer();

/**
 * @type {string}
 */
Gui.Timer.ViewModel.Window.Timer.prototype.cacheKey = 'id';

/**
 * initialize resources
 */
Gui.Timer.ViewModel.Window.Timer.prototype.init = function () {

    this.resource = this.data.resource;
    this.broadcast = this.data.broadcast;
    this.view = this.data.view;

    this.baseUrl = VDRest.Api.Resource.prototype.getBaseUrl();

    this.view.getEpgImage = this.getEpgImage.bind(this);

    this.view.getEpisodeImage = this.getEpisodeImage.bind(this);

    this.view.getFanart = this.getFanart.bind(this);

    this.initViewMethods();
};

/**
 * add magic methods
 */
Gui.Timer.ViewModel.Window.Timer.prototype.initViewMethods = function () {

    var me = this;

    this.data.view.getBroadcast = function () {

        return me.broadcast;
    };

    this.data.view.getDate = function () {

        var date = new Date(me.data.resource.data.day);

        return VDRest.helper.getWeekDay(date, true) + '. ' + VDRest.helper.getDateString(date, true);
    };

    this.data.view.getStartTime = function () {

        return VDRest.helper.getTimeString(new Date(me.data.resource.data.start_timestamp));
    };

    this.data.view.getEndTime = function () {

        return VDRest.helper.getTimeString(new Date(me.data.resource.data.stop_timestamp))
    };

    this.data.view.getDirName = function () {

        return me.data.resource.data.filename.split('~').slice(0, -1).join('~');
    };

    VDRest.Abstract.ViewModel.prototype.initViewMethods.call(this, this.data.broadcast, 'broadcast');

    VDRest.Abstract.ViewModel.prototype.initViewMethods.call(this);

    this.data.view.getFilename = function () {

        var wholeName = me.data.resource.data.filename;

        return wholeName.split('~').pop();
    };
};

/**
 * retrieve epg image
 * @returns {String|Boolean}
 */
Gui.Timer.ViewModel.Window.Timer.prototype.getEpgImage = function () {

    var images = this.broadcast.getData('images');

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
Gui.Timer.ViewModel.Window.Timer.prototype.getFanart = function (width) {

    /**
     * @type {additionalMediaEpisode|additionalMediaMovie}
     */
    var media = this.broadcast.getData('additional_media'),
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
Gui.Timer.ViewModel.Window.Timer.prototype.getEpisodeImage = function (width) {

    /**
     * @type {additionalMediaEpisode|additionalMediaMovie}
     */
    var media = this.broadcast.getData('additional_media'),
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
