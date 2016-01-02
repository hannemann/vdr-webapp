/**
 * @class
 * @constructor
 */
Gui.Recordings.ViewModel.List.Recording = function () {};

/**
 * @type {VDRest.Abstract.ViewModel}
 */
Gui.Recordings.ViewModel.List.Recording.prototype = new VDRest.Abstract.ViewModel();

/**
 * @type {string}
 */
Gui.Recordings.ViewModel.List.Recording.prototype.cacheKey = 'file_name';

/**
 * date regex
 * @type {RegExp}
 */
Gui.Recordings.ViewModel.List.Recording.prototype.dateReg = /([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/;

/**
 * initilize view
 */
Gui.Recordings.ViewModel.List.Recording.prototype.init = function () {

    this.baseUrl = VDRest.Api.Resource.prototype.getBaseUrl();

    this.initViewMethods();
};

/**
 * add specific methods to view
 */
Gui.Recordings.ViewModel.List.Recording.prototype.initViewMethods = function () {

    var me = this;

    VDRest.Abstract.ViewModel.prototype.initViewMethods.call(this);

    this.data.view.getStartDate = function () {

        var date = new Date(me.data.resource.data.event_start_time * 1000), string = '';

        string += me.helper().getWeekDay(date, true) + '. ' + me.helper().getDateString(date, true);

        return string;
    };

    this.data.view.getStartTime = function () {

        var date = new Date(me.data.resource.data.event_start_time * 1000), string = '';

        string += me.helper().getTimeString(date);

        return string;
    };

    this.data.view.getStartDateTime = function () {

        var date = new Date(me.data.resource.data.event_start_time * 1000), string = '';

        string += me.helper().getWeekDay(date, true) + '. ' + me.helper().getDateTimeString(date, true);

        return string;
    };

    this.data.view.getDurationString = function () {

        return '(' + me.helper().getDurationAsString(this.getDuration()) + ')';
    };

    this.data.view.getNormalizedFileName = function () {

        return me.data.view.getName().split('~').pop();
    };

    this.data.view.getPath = function () {

        return me.data.view.getName().split('~').slice(0, -1).join('~');
    };

    VDRest.Helper.prototype.parseDescription.call(this, this.data.resource.data.event_description);

    this.data.view.getFanart = this.getFanart.bind(this);

    this.data.view.getEpisodeImage = this.getEpisodeImage.bind(this);
};

/**
 * retrieve fanart
 * @param {Number} width
 * @returns {String|Boolean}
 */
Gui.Recordings.ViewModel.List.Recording.prototype.getFanart = function (width) {

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
Gui.Recordings.ViewModel.List.Recording.prototype.getEpisodeImage = function (width) {

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