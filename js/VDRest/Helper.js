VDRest.Helper = function () {

    this.isTouchDevice = "ontouchstart" in document;

    this.isFirefox = "object" == typeof navigator.mozApps;

    this.touchMoveCapable = this.isTouchDevice && !this.isFirefox;

    document.body.classList.add('is' + (this.isTouchDevice ? '' : '-not') + '-touch');
    this.getScrollbarWidth();

    if (this.isFirefox) {
        document.body.classList.add('is-firefox');
    }

    this.pointerStartHandler = this.getPointerStart.bind(this);
    this.pointerMoveHandler = this.getCanCancelEvent.bind(this);
    if (this.isTouchDevice) {
        this.pointerStart = 'touchstart';
        this.pointerMove = 'touchmove';
        this.pointerEnd = 'touchend';
    } else {
        this.pointerStart = 'mousedown';
        this.pointerMove = 'mousemove';
        this.pointerEnd = 'mouseup';
    }
    window.addEventListener(this.pointerStart, this.pointerStartHandler);
    window.addEventListener(this.pointerMove, this.pointerMoveHandler);
};

/**
 * retrieve pointer delta
 * @param {Event} e
 */
VDRest.Helper.prototype.getPointerDelta = function (e) {

    if (!this.pointerStartPosition) {
        this.getPointerStart(e);
    }

    if (this.isTouchDevice) {
        this.pointerDelta = {
            "x": this.pointerStartPosition.x - e.changedTouches[0].pageX,
            "y": this.pointerStartPosition.y - e.changedTouches[0].pageY
        };
    } else {
        this.pointerDelta = {
            "x": this.pointerStartPosition.x - e.pageX,
            "y": this.pointerStartPosition.y - e.pageY
        };
    }
    return this.pointerDelta;
};

/**
 * get pointer start position
 * @param {Event} e
 */
VDRest.Helper.prototype.getPointerStart = function (e) {

    this.canCancelEvent = false;

    this.pointerDelta = {
        "x": 0,
        "y": 0
    };

    if (this.isTouchDevice) {
        this.pointerStartPosition = {
            "x" : e.changedTouches[0].pageX,
            "y" : e.changedTouches[0].pageY
        };
    } else {
        this.pointerStartPosition = {
            "x" : e.pageX,
            "y" : e.pageY
        };
    }
};

/**
 * determine if event is cancelable
 * @param {Event} e
 */
VDRest.Helper.prototype.getCanCancelEvent = function (e) {

    var delta = this.getPointerDelta(e);

    if ("undefined" !== typeof this.pointerStartPosition &&
        (Math.abs(delta.x) > 5 ||
        Math.abs(delta.y) > 5)
    ) {

        this.canCancelEvent = true;
    }
};

/**
 * determine if device is connected to any network
 * we assume that desktop browsers are always connected
 * @return {boolean}
 */
VDRest.Helper.prototype.hasConnection = function () {

    return (!navigator.connection || navigator.connection.type != 'none')
};

VDRest.Helper.prototype.isVisible = function () {

    return 'visible' === document.visibilityState;
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

VDRest.Helper.prototype.monthNames = function () {
    return [
        VDRest.app.translate("January"),
        VDRest.app.translate("February"),
        VDRest.app.translate("March"),
        VDRest.app.translate("April"),
        VDRest.app.translate("May"),
        VDRest.app.translate("June"),
        VDRest.app.translate("July"),
        VDRest.app.translate("August"),
        VDRest.app.translate("September"),
        VDRest.app.translate("October"),
        VDRest.app.translate("November"),
        VDRest.app.translate("December")
    ]
};

/**
 * log to console in debug mode
 */
VDRest.Helper.prototype.log = function () {

    if (VDRest.config.getItem('debug')) {

        console.log.apply(console, arguments);
    }
};

/**
 * log to console in debug mode
 */
VDRest.Helper.prototype.error = function () {

    if (VDRest.config.getItem('debug')) {

        console.error.apply(console, arguments);
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


VDRest.Helper.prototype.ratingRegex = new RegExp('(((?:[Ww]ertung: *)([0-9])/[0-9])|([*]{1,}\n))', 'm');


VDRest.Helper.prototype.tippRegex = new RegExp('\\[Tipp\\]', 'm');


VDRest.Helper.prototype.topTippRegex = new RegExp('\\[TopTipp\\]', 'm');


VDRest.Helper.prototype.tagesTippRegex = new RegExp('\\[TagesTipp\\]', 'm');


/**
 * call in context of view model
 * @param {string} description
 * @returns {*}
 */
VDRest.Helper.prototype.parseDescription = function (description) {

    //var rating = new RegExp('(((?:[Ww]ertung: *)([0-9])/[0-9])|([*]{1,}))', 'm'),
    //    tipp = new RegExp('\\[Tipp\\]', 'm'),
    //    topTipp = new RegExp('\\[TopTipp\\]', 'm'),
    //    tagesTipp = new RegExp('\\[TagesTipp\\]', 'm');

    this.data.view.getRating = function () {

        var rating;

        VDRest.Helper.prototype.ratingRegex.test(description);
        rating = RegExp.$1 == RegExp.$4 ? RegExp.$1.length - 1 : RegExp.$2 ? parseInt(RegExp.$3, 10) : undefined;

        return isNaN(rating) ? 0 : rating;
    };

    this.data.view.getTip = function () {

        return VDRest.Helper.prototype.tippRegex.test(description);
    };

    this.data.view.getTopTip = function () {

        return VDRest.Helper.prototype.topTippRegex.test(description);
    };

    this.data.view.getTipOfTheDay = function () {

        return VDRest.Helper.prototype.tagesTippRegex.test(description);
    };

    return this;
};

/**
 * retrieve base streamurl
 * @param {Array} [extraParams]
 * @returns {string}
 */
VDRest.Helper.prototype.getBaseStreamUrl = function (extraParams) {

    var streamdevParams = [], url, port = VDRest.config.getItem('streamdevPort');

    streamdevParams.push(VDRest.config.getItem('streamdevParams'));

    if (extraParams) {
        streamdevParams = streamdevParams.concat(extraParams);
    }

    url = VDRest.config.getItem('streamdevProtocol')
        + '://'
    + VDRest.config.getItem('streamdevHost');

    if (port !== 443 && port !== 80) {
        url += ':'
        + VDRest.config.getItem('streamdevPort')
    }
    return url + '/' + streamdevParams.join(';') + '/';
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

VDRest.Helper.prototype.getScrollbarWidth = function () {

    var outer, widthNoScroll, inner, widthWithScroll;

    if (!this.scrollbarWidth) {
        outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

        document.body.appendChild(outer);

        widthNoScroll = outer.offsetWidth;
        // force scrollbars
        outer.style.overflow = "scroll";

        // add innerdiv
        inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);

        widthWithScroll = inner.offsetWidth;

        // remove divs
        outer.parentNode.removeChild(outer);
        this.scrollbarWidth = widthNoScroll - widthWithScroll
    }

    return this.scrollbarWidth;
};

VDRest.Helper.prototype.getMaxScreenResolution = function (orientation) {

    if ("landscape" === orientation) {
        return {
            "width": Math.max(screen.availHeight, screen.availWidth),
            "height": Math.min(screen.availHeight, screen.availWidth)
        };
    } else {
        return {
            "width": Math.min(screen.availHeight, screen.availWidth),
            "height": Math.max(screen.availHeight, screen.availWidth)
        };
    }
};

/**
 * retrieve current device orientation
 * @returns {string}
 */
VDRest.Helper.prototype.getOrientation = function () {

    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
};

VDRest.helper = new VDRest.Helper();
