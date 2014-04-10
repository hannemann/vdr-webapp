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
 * initialize node
 */
Gui.Epg.View.TimeLine.prototype.init = function () {

    this.node = $('<div id="time-line">');
};

/**
 * init markup and append to dom
 */
Gui.Epg.View.TimeLine.prototype.render = function () {

    this.renderTimeLine();

    $.event.trigger({
        "type" : "epg.date.changed",
        "date" : this.getStartDate()
    });

    VDRest.Abstract.View.prototype.render.call(this);
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
        quarterWidth,

    /// TODO: Bug zwischen 23:45 und 0:00 <- Datum Falsch
        firstDate;

    if (!this.isRendered) {
        quarterWidth = this.getQuarterWidth();
        quarterEnd = this.getNextQuarterEnd();
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
        if (quarterWidth) {
            markup += '<div data-date="' + firstDate + '" class="ql ' + className + '" style="width: ' + quarterWidth + 'px">' + ql + '</div>';
            width += quarterWidth;
            quarterWidth = undefined;
        } else {
            markup += '<div' + (newDate ? ' data-date="' + newDate + '"' : '') + ' class="ql ' + className + '">' + ql + '</div>';
            width += 60;
        }
        if (q === 0) {
            if (className.indexOf('even') > -1) {
                className = className.replace('even', 'odd');
            } else {
                className = className.replace('odd', 'even');
            }
        }
        markup += '<div class="qr ' + className + '">' + qr + '</div>';

        quarterEnd = this.getNextQuarterEnd();
    } while(quarterEnd < end);

    this.node.width(width).append(markup);
};
