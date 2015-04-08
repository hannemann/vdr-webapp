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
 * periodical update
 */
Gui.Epg.View.TimeLine.prototype.update = function () {

    var firstDate = parseInt(this.node[0].firstChild.getAttributeNode('data-date').value, 10),
        startTime = this.getStartDate().getTime(),
        timeDiff = firstDate - startTime,
        quarterWidth = this.getQuarterWidth(), i = 0,
        pixelToRemove, nodesToRemove,
        pixelPerSecond = VDRest.config.getItem('pixelPerSecond'),
        width;

    if (timeDiff < 0) {
        pixelToRemove = Math.ceil(Math.abs(timeDiff) / 1000 * pixelPerSecond);
        nodesToRemove = Math.ceil(pixelToRemove / quarterWidth);
        /** add one if necessary since 15 minutes consist of 2 nodes */
        nodesToRemove += nodesToRemove % 2 == 0 ? 0 : 1;
        for (i; i < nodesToRemove; i++) {
            this.node[0].removeChild(this.node[0].firstChild);
            firstDate += i % 2 == 0 ? 1000 * 60 * 15 : 0;
        }
        timeDiff = firstDate - startTime;
        $(this.node[0].firstChild).attr('data-date', firstDate);
    }

    width = Math.round(timeDiff / 1000 * pixelPerSecond);
    width = width > 0 ? width + 'px' : 0;
    this.node[0].firstChild.style.width = width;

    if ($(this.node[0].lastChild).offset().left < this.module.getController('Epg').getMetrics().win.width) {

        this.renderTimeLine();
    }

    this.setDate(this.getStartDate());
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
        className,
        newDate = null,
        width = this.node.width(),
        quarterEnd,
        firstQuarterData,
        quarterWidth = this.getQuarterWidth(),
        widthStyle,
        firstDate;

    className = end.getHours() % 2 == 0 ? 'even' : 'odd';

    if (!this.isRendered) {
        firstQuarterData = this.getFirstQuarterData();
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
        if ("undefined" !== typeof firstQuarterData) {
            widthStyle = firstQuarterData.width > 0 ? firstQuarterData.width.toString() + 'px' : '0';
            markup += '<div data-date="' + firstDate + '" class="ql ' + className + '" style="width: ' + widthStyle + '">' + ql + '</div>';
            width += firstQuarterData.width;
            firstQuarterData = undefined;
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