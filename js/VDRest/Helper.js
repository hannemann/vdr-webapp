VDRest.Helper = function () {

    this.isTouchDevice = "ontouchstart" in document;

    if (this.isTouchDevice) {
        document.body.classList.add('is-touch');
    }
};

/**
 * retrieve instance of Date
 * @returns {Date}
 */
VDRest.Helper.prototype.now = function () {

    return new Date();
};

/**
 * retrieve time string from date object
 * @param {Date} date
 * @param {Boolean} [withSeconds]
 * @return {*}
 */
VDRest.Helper.prototype.getTimeString = function (date, withSeconds) {
	if (date instanceof Date) {
		return this.pad(date.getHours(), 2)
            + ':' + this.pad(date.getMinutes(), 2)
            + (withSeconds ? ':' + this.pad(date.getSeconds(), 2) : '');
	}
	return false;
};

/**
 * retrieve date string from date object
 * @param {Date} date
 * @param {Boolean} fullYear
 * @return {string|Boolean}
 */
VDRest.Helper.prototype.getDateString = function (date, fullYear) {

    fullYear = fullYear || false;
    if (date instanceof Date) {
        return this.pad(date.getDate(), 2)+'.'+this.pad(date.getMonth()+1, 2) + (fullYear ? '.' + date.getFullYear() : '');
    }
    return false;
};

/**
 * retrieve datetime string from date object
 * @param {Date} date
 * @param {Boolean} [fullYear]
 * @return {*}
 */
VDRest.Helper.prototype.getDateTimeString = function (date, fullYear) {
    if (date instanceof Date) {
        return this.getDateString(date, fullYear)+' '+this.getTimeString(date);
    }
    return false;
};

/**
 * match string against reg and return date
 * @param {string} time
 * @param {RegExp} reg
 * @return {Date|Boolean}
 */
VDRest.Helper.prototype.strToDate = function (time, reg) {

    if (!reg instanceof RegExp) {

        throw 'Argument reg is not of type RegExp';
    }

    if (time.match(reg)) {

        return new Date(
            parseInt(RegExp.$1, 10),
            parseInt(RegExp.$2, 10)-1,
            parseInt(RegExp.$3, 10),
            parseInt(RegExp.$4 ? RegExp.$4 : 0, 10),
            parseInt(RegExp.$5 ? RegExp.$5 : 0, 10),
            parseInt(RegExp.$6 ? RegExp.$6 : 0, 10)
        );
    }
    return false;
};

/**
 * pad zeros
 * @param {number|string} n
 * @param {number} width
 * @param {number|string} [z]
 * @return {String}
 */
VDRest.Helper.prototype.pad = function (n, width, z) {

	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

/**
 * convert seconds to hh:mm
 * @param {int} duration
 * @param {Boolean} [withSeconds]
 * @return {String}
 */
VDRest.Helper.prototype.getDurationAsString = function (duration, withSeconds) {

    var minutes = Math.floor(duration / 60),
        seconds = this.pad(parseInt(duration - minutes * 60), 2),
        hours = Math.floor(duration / 3600);

    minutes = this.pad(minutes - hours * 60, 2);

    return hours + ':' + minutes + (withSeconds ? ':' + seconds : '');
};

/**
 * get day of week from date object
 * @param {Date} date
 * @param {Boolean} [abbr]
 * @return {string|boolean}
 */
VDRest.Helper.prototype.getWeekDay = function (date, abbr) {

	if (date instanceof Date) {

		return abbr
            ? VDRest.app.translate(this.weekDays[date.getDay()]).substr(0,2)
            : VDRest.app.translate(this.weekDays[date.getDay()]);
	}
	return false;
};

VDRest.Helper.prototype.weekDays = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

/**
 * log to console in debug mode
 */
VDRest.Helper.prototype.log = function () {

    if (VDRest.config.getItem('debug')) {

        console.log.apply(console, arguments);
    }
};

/**
 * decode vdr style entity encoding
 * @param {String} string
 * @return {*}
 */
VDRest.Helper.prototype.vdrDecodeURI = function (string) {

    try {

        string = decodeURIComponent(encodeURIComponent(string).replace(/%23/g, '%'));

    } catch (e) {}

    return string.replace(/_/g, ' ');
};

/**
 * sort by name property in data object
 * @param a
 * @param b
 * @returns {number}
 */
VDRest.Helper.prototype.sortAlpha = function (a, b) {

    a = a.data.name.toLowerCase().replace(/^[^a-z]/, '');
    b = b.data.name.toLowerCase().replace(/^[^a-z]/, '');

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
};

/**
 * call in context of view model
 * @param {string} description
 * @returns {*}
 */
VDRest.Helper.prototype.parseDescription = function (description) {

    var rating = new RegExp('(((?:[Ww]ertung: *)([0-9])/[0-9])|([*]{1,}))', 'm'),
        tipp = new RegExp('\\[Tipp\\]', 'm'),
        topTipp = new RegExp('\\[TopTipp\\]', 'm'),
        tagesTipp = new RegExp('\\[TagesTipp\\]', 'm');

    rating.test(description);
    rating = RegExp.$1 == RegExp.$4 ? RegExp.$1.length : RegExp.$2 ? parseInt(RegExp.$3, 10) : undefined;

    this.data.view.getRating = function () {

        return isNaN(rating) ? 0 : rating;
    };

    this.data.view.getTip = function () {

        return tipp.test(description);
    };

    this.data.view.getTopTip = function () {

        return topTipp.test(description);
    };

    this.data.view.getTipOfTheDay = function () {

        return tagesTipp.test(description);
    };

    return this;
};

/**
 * retrieve base streamurl
 * @param {Array} [extraParams]
 * @returns {string}
 */
VDRest.Helper.prototype.getBaseStreamUrl = function (extraParams) {

    var streamdevParams = [];

    streamdevParams.push(VDRest.config.getItem('streamdevParams'));

    if (extraParams) {
        streamdevParams = streamdevParams.concat(extraParams);
    }

    return VDRest.config.getItem('streamdevProtocol')
        + '://'
        + VDRest.config.getItem('streamdevHost')
        + ':'
        + VDRest.config.getItem('streamdevPort')
        + '/' + streamdevParams.join(';') + '/';
};

/**
 * stop propagation of jQuery.Event
 * @param {jQuery.Event} e
 */
VDRest.Helper.prototype.stopPropagation = function (e) {

    if (e instanceof jQuery.Event) {
        e.stopPropagation();
    }
};

/**
 * determine if app runs in fullscreen
 */
VDRest.Helper.prototype.getIsFullscreen = function () {


    var isFullscreen = false;

    if ("undefined" != typeof document.fullScreen) {
        isFullscreen = document.fullScreen;
    }

    if ("undefined" != typeof document.mozFullscreen) {
        isFullscreen = document.mozFullscreen;
    }

    if ("undefined" != typeof document.webkitIsFullScreen) {
        isFullscreen = document.webkitIsFullScreen;
    }

    return isFullscreen;
};

VDRest.helper = new VDRest.Helper();
