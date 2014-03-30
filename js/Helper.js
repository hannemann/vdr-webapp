Helper = function () {};

/**
 * retrieve time string from date object
 * @param {Date}
 * @return {*}
 */
Helper.prototype.getTimeString = function (date) {
	if (date instanceof Date) {
		return this.pad(date.getHours(), 2)+':'+this.pad(date.getMinutes(), 2);
	}
	return false;
};

/**
 * retrieve date string from date object
 * @param {Date}
 * @param {Boolean}
 * @return {*}
 */
Helper.prototype.getDateString = function (date, fullYear) {

    fullYear = fullYear || false;
    if (date instanceof Date) {
        return this.pad(date.getDate(), 2)+'.'+this.pad(date.getMonth()+1, 2) + (fullYear ? '.' + date.getFullYear() : '');
    }
    return false;
};

/**
 * retrieve datetime string from date object
 * @param {Date}
 * @param {Boolean}
 * @return {*}
 */
Helper.prototype.getDateTimeString = function (date, fullYear) {
    if (date instanceof Date) {
        return this.getDateString(date, fullYear)+' '+this.getTimeString(date);
    }
    return false;
};

/**
 * match string against reg and return date
 * @param {string}
 * @param {RegExp}
 * @return {Date|Boolean}
 */
Helper.prototype.strToDate = function (time, reg) {

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
 * @param {String}
 * @param {int}
 * @param {int|string}
 * @return {String}
 */
Helper.prototype.pad = function (n, width, z) {

	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

/**
 * convert seconds to hh:mm
 * @param {int}
 * @return {String}
 */
Helper.prototype.getDurationAsString = function (duration) {

    var hours = parseInt(duration/60/60, 10),
        minutes = Math.round((duration - parseInt(duration/60/60, 10)*60*60)/60);

	return this.pad(hours, 2) + ':' + this.pad(minutes, 2)
};

/**
 * get day of week from date object
 * @param {Date}
 * @param {Boolean}
 * @return {*}
 */
Helper.prototype.getWeekDay = function (date, abbr) {

	if (date instanceof Date) {

		return abbr ? this.weekDays[date.getDay()].substr(0,2) : this.weekDays[date.getDay()];
	}
	return false;
};

Helper.prototype.weekDays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

/**
 * log to console in debug mode
 */
Helper.prototype.log = function () {

    if (config.getItem('debug')) {

        console.log.apply(window, arguments);
    }
};

/**
 * decode vdr style entity encoding
 * @param {String}
 * @return {*}
 */
Helper.prototype.vdrDecodeURI = function (string) {

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

helper = new Helper();
