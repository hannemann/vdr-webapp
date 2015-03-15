/**
 * @class
 * @constructor
 */
Gui.Epg.ViewModel.Broadcasts.List.Broadcast = function () {};

/**
 * @type {VDRest.Lib.Cache.store.ViewModel}
 */
Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype = new VDRest.Abstract.ViewModel();

/**
 * cache key
 * @type {string}
 */
Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype.cacheKey = 'channel/id';

/**
 * pixels per second
 */
Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype.pixelPerSecond = VDRest.config.getItem('pixelPerSecond');

/**
 * init view methods
 */
Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype.init = function () {

    this.resource = this.data.resource.data;

    this.baseUrl = VDRest.Api.Resource.prototype.getBaseUrl();

    this.calculateMetrics();

    VDRest.Helper.prototype.parseDescription.call(this, this.resource.description);

    this.initViewMethods();
};

/**
 * decorate view with magic methods
 */
Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype.initViewMethods = function () {

    VDRest.Abstract.ViewModel.prototype.initViewMethods.call(this);

    /**
     * determine if is currently recording
     * @returns {object}
     */
    this.data.view.getIsRecording = function () {

        var date = new Date(), recordingStartDate, recordingEndDate;

        if (this.getTimerExists() && this.getTimerActive()) {

            recordingStartDate = this.getVps() > 0 && VDRest.config.getItem('autoVps')
                ? new Date(this.getVps() * 1000)
                : new Date((this.getStartTime() - VDRest.config.getItem('recordingStartMargin')) * 1000);

            recordingEndDate = new Date((this.getEndTime() + VDRest.config.getItem('recordingEndMargin')) * 1000);

            if (date > recordingStartDate && date < recordingEndDate) {

                return true;
            }
        }

        return  false;
    };

    this.data.view.getFanart = this.getFanart.bind(this);

    this.data.view.getEpgImage = this.getEpgImage.bind(this);

    this.data.view.getEpisodeImage = this.getEpisodeImage.bind(this);
};

/**
 * decorate view with methods to retrieve its metrics
 */
Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype.calculateMetrics = function () {

    var duration,
        from = this.module.getFromDate(),
        width, left, right, me = this;

    if (this.resource.start_date < from) {

        duration = Math.round((this.resource.end_date.getTime() / 1000 - from.getTime() / 1000));
        left = 0;
    } else {
        duration = this.resource.duration;
        left = Math.round((this.resource.start_date.getTime() / 1000 - from.getTime() / 1000) * this.pixelPerSecond)
    }

    width = Math.round(duration * this.pixelPerSecond);

    /**
     * retrieve desired width of node
     * @returns {number}
     */
    this.data.view.getWidth = function () {

        return width;
    };

    /**
     * retrieve desired offset of node from left
     * @returns {number}
     */
    this.data.view.getLeft = function () {

        return left;
    };

    right = left + width;
    /**
     * retrieve desired offset of nodes right border from left
     * @returns {number}
     */
    this.data.view.getRight = function () {

        return right;
    };
    /**
     * retrieve offset of nodes relative to visible area
     * @returns {object}
     */
    this.data.view.getOffset = function () {

        return me.data.view.node.offset();
    };

    return this;
};

/**
 * retrieve epg image
 * @returns {String|Boolean}
 */
Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype.getEpgImage = function () {

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
Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype.getFanart = function (width) {

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
Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype.getEpisodeImage = function (width) {

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
