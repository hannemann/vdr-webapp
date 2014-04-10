/**
 * @class
 * @constructor
 *
 * @var {object} resource
 * @property {Date} start_date
 * @var {Date} quarterEnd
 * @var {object} data
 * @property {Date] from
 */
Gui.Epg.ViewModel.TimeLine = function () {};

/**
 * @type {VDRest.Lib.Cache.store.ViewModel}
 */
Gui.Epg.ViewModel.TimeLine.prototype = new VDRest.Abstract.ViewModel();

/**
 * pixels per second
 */
Gui.Epg.ViewModel.TimeLine.prototype.pixelPerSecond = VDRest.config.getItem('pixelPerSecond');

/**
 * init view methods
 */
Gui.Epg.ViewModel.TimeLine.prototype.init = function () {

    var me = this;

    this.resource = {
        "start_date" : this.data.from
    };

    this.initViewMethods();

    this.quarterEnd = this.data.from;

    this.data.view.getQuarterEnd = function () {

        return me.quarterEnd;
    };

    this.data.view.getNextQuarterEnd = function () {

        return me.getNextQuarterEnd();
    };

    this.data.view.getQuarterStart = function () {

        return me.getQuarterStart();
    };

    this.data.view.getQuarterWidth = function () {

        return me.getQuarterWidth();
    };

    this.data.view.getDateString = function () {

        return me.getDateString();
    };

    this.data.view.getEndTime = function () {

        return new Date(me.quarterEnd.getTime() + 1000 * 60 * 60 * 24);
    };
};

/**
 * retrieve date object of next quarter end point
 * @returns {Date}
 */
Gui.Epg.ViewModel.TimeLine.prototype.getNextQuarterEnd = function () {

    var minute, hour, quarter, nextHour, year, month, day;

    if (this.quarterEnd === this.data.from) {

        minute = this.data.from.getMinutes();
        hour = this.data.from.getHours();
        year = this.data.from.getFullYear();
        month = this.data.from.getMonth();
        day = this.data.from.getDate();
        quarter = (((minute + 15) / 15 | 0) * 15) % 60;
        nextHour = (((minute / 60 + .25) | 0) + hour) % 24;

        this.quarterEnd = new Date(year, month, day, nextHour, quarter, 0);

        return this.quarterEnd;
    }

    // add 15 minutes to end of next quarter
    this.quarterEnd.setTime(this.quarterEnd.getTime() + 1000 * 60 * 15);

    return this.quarterEnd;
};

/**
 * retrieve date object start of next quarter
 * @returns {Date}
 */
Gui.Epg.ViewModel.TimeLine.prototype.getQuarterStart = function () {

    if (!this.quarterEnd) {

        return this.data.from;
    } else {

        return this.quarterEnd;
    }
};

/**
 * retrieve desired width of quarter node
 * @returns {number}
 */
Gui.Epg.ViewModel.TimeLine.prototype.getQuarterWidth = function () {

    /** @type {number} duration */
    var start = this.getQuarterStart().getTime(),
        duration = Math.round( (this.getNextQuarterEnd().getTime() - start ) / 1000);

    return Math.round(duration * this.pixelPerSecond);
};

/**
 * retrieve abbreviated string of current date
 * @returns {string}
 */
Gui.Epg.ViewModel.TimeLine.prototype.getDateString = function () {

    var day = VDRest.helper.getWeekDay(this.quarterEnd, true),
        date = VDRest.helper.getDateString(this.quarterEnd);

    return day + '. ' + date;
};
