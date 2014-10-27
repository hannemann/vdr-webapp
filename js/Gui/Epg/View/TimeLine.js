/**
 * @class
 * @constructor
 *
 * @method {Date} getStartDate
 * @method {Gui.Epg.View.TimeLine} setStartDate Date
 * @method {boolean} hetStartDate
 */
Gui.Epg.View.TimeLine = function () {};

/**
 * @type {VDRest.Lib.Cache.store.View}
 */
Gui.Epg.View.TimeLine.prototype = new VDRest.Abstract.View();

/**
 * initialize nodes
 */
Gui.Epg.View.TimeLine.prototype.init = function () {

    this.node = $('<div id="time-line">');
    this.date = $('<div id="epg-date">');
    this.gradient = $('<div id="epg-timeline-right-gradient">');
};

/**
 * init markup and append to dom
 */
Gui.Epg.View.TimeLine.prototype.render = function () {

    this.renderTimeLine();
    this.setDate(this.getStartDate());
    this.date.appendTo(this.parentView.node);
    this.gradient.appendTo(this.parentView.node);

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * set date text node
 * @param date
 */
Gui.Epg.View.TimeLine.prototype.setDate = function (date) {

    var dateString = VDRest.helper.getWeekDay(date, true) + ', ' + VDRest.helper.getDateString(date);

    this.date.text(dateString);
};

/**
 * create markup
 */
Gui.Epg.View.TimeLine.prototype.renderTimeLine = function () {

    var end = this.getEndTime(),
        q, ql, qr,
        markup = '',
        className = 'even',
        newDate = null,
        width = this.node.width(),
        quarterEnd,
        firstQuarterWidth,
        quarterWidth = this.getQuarterWidth(),

    /// TODO: Bug zwischen 23:45 und 0:00 <- Datum Falsch
        firstDate;

    if (!this.isRendered) {
        firstQuarterWidth = this.getFirstQuarterWidth();
        quarterEnd = this.getQuarterEnd();
        firstDate = quarterEnd.getTime();
    } else {
        quarterEnd = this.getQuarterEnd();
    }

    do {
        q = quarterEnd.getMinutes();
        if (q > 0) {
            ql = q.toString()[0];
            qr = q.toString()[1];
            className = className.replace(' hour', '');
            newDate = null;
        } else {
            ql = quarterEnd.getHours().toString();
            qr = '00';
            className = className + " hour";
            if (quarterEnd.getHours() === 0) {
                newDate = quarterEnd.getTime();
            }
        }
        if (firstQuarterWidth) {
            markup += '<div data-date="' + firstDate + '" class="ql ' + className + '" style="width: ' + firstQuarterWidth + 'px">' + ql + '</div>';
            width += firstQuarterWidth;
            firstQuarterWidth = undefined;
        } else {
            markup += '<div' + (newDate ? ' data-date="' + newDate + '"' : '') + ' class="ql ' + className + '" style="width: ' + quarterWidth + 'px">' + ql + '</div>';
            width += quarterWidth * 8;
        }
        if (q === 0) {
            if (className.indexOf('even') > -1) {
                className = className.replace('even', 'odd');
            } else {
                className = className.replace('odd', 'even');
            }
        }
        markup += '<div class="qr ' + className + '" style="width: ' + quarterWidth + 'px">' + qr + '</div>';

        quarterEnd = this.getNextQuarterEnd();
    } while(quarterEnd < end);

    this.node.width(width).append(markup);
};

/**
 * destroy timeline
 */
Gui.Epg.View.TimeLine.prototype.destruct = function () {

    this.date.remove();
    this.gradient.remove();

    VDRest.Abstract.View.prototype.destruct.call(this);
};