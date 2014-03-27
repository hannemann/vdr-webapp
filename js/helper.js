Helper = function () {};

Helper.prototype.getTimeString = function (date) {
	if (date instanceof Date) {
		return this.pad(date.getHours(), 2)+':'+this.pad(date.getMinutes(), 2);
	}
	return false;
};

Helper.prototype.getDateString = function (date) {
	if (date instanceof Date) {
		return this.pad(date.getDate(), 2)+'.'+this.pad(date.getMonth(), 2);
	}
	return false;
};

Helper.prototype.pad = function (n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

Helper.prototype.getDurationAsString = function (duration) {
	return this.pad(parseInt(duration/60/60, 10), 2) + ':' + this.pad((duration - parseInt(duration/60/60, 10)*60*60)/60, 2)
};

Helper.prototype.getWeekDay = function (date, abbr) {
	if (date instanceof Date) {
		return abbr ? this.weekDays[date.getDay()].substr(0,2) : this.weekDays[date.getDay()];
	}
	return false;
};

Helper.prototype.weekDays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

Helper.prototype.log = function () {
    if (config.getItem('debug')) {
        console.log.apply(window, arguments);
    }
};

Array.prototype.unique = function(){
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
