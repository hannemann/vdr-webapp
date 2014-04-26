VDRest.Helper = function () {};

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
 * @return {*}
 */
VDRest.Helper.prototype.getTimeString = function (date) {
	if (date instanceof Date) {
		return this.pad(date.getHours(), 2)+':'+this.pad(date.getMinutes(), 2);
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
 * @return {String}
 */
VDRest.Helper.prototype.getDurationAsString = function (duration) {

    var hours = parseInt(duration/60/60, 10),
        minutes = Math.round((duration - parseInt(duration/60/60, 10)*60*60)/60);

	return this.pad(hours, 2) + ':' + this.pad(minutes, 2)
};

/**
 * get day of week from date object
 * @param {Date} date
 * @param {Boolean} [abbr]
 * @return {string|boolean}
 */
VDRest.Helper.prototype.getWeekDay = function (date, abbr) {

	if (date instanceof Date) {

		return abbr ? this.weekDays[date.getDay()].substr(0,2) : this.weekDays[date.getDay()];
	}
	return false;
};

VDRest.Helper.prototype.weekDays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

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
* remove duplicates
* @return {Array}
*/
Array.prototype.unique = function() {

    var u = {}, a = [];
    for(var i = 0, l = this.length; i < l; ++i){
        if(u.hasOwnProperty(this[i])) {
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
    return a;
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

    var rating = new RegExp('(?:Wertung:|Bewertung:)\\s*([0-9])/[0-9]'),
        topTipp = new RegExp('(TagesTipp|TopTipp)', 'm');

    rating.test(description);

    rating = parseInt(RegExp.$1, 10);

    this.data.view.getRating = function () {

        return isNaN(rating) ? 0 : rating;
    };

    this.data.view.getTopTip = function () {

        return topTipp.test(description);
    };

    return this;
};

VDRest.helper = new VDRest.Helper();
