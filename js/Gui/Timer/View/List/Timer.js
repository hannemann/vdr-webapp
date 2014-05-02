/**
 * @class
 * @constructor
 */
Gui.Timer.View.List.Timer = function () {};

/**
 *
 * @type {VDRest.Abstract.View}
 */
Gui.Timer.View.List.Timer.prototype = new VDRest.Abstract.View();

/**
 * @type {string}
 */
Gui.Timer.View.List.Timer.prototype.cacheKey = 'id';

/**
 * initialize nodes
 */
Gui.Timer.View.List.Timer.prototype.init = function () {

    this.node = $('<div class="timer list-item clearer">');

    this.date = $('<span class="date">').appendTo(this.node);

    this.channel = $('<span class="channel">').appendTo(this.node);

    this.time = $('<span class="time">').appendTo(this.node);

    this.name = $('<div class="filename">').appendTo(this.node);
};

/**
 * decorate and render
 */
Gui.Timer.View.List.Timer.prototype.render = function () {

    this.decorate();

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * decorate
 */
Gui.Timer.View.List.Timer.prototype.decorate = function () {

    this.channel.text(this.getChannelName());

    this.name.text(this.getFilename());

    this.date.text(this.addStartDate());

    this.time.text(this.addTime());
};

/**
 * decorate and render
 */
Gui.Timer.View.List.Timer.prototype.update = function () {

    this.decorate();
};

/**
 * retrieve start date as fancy string
 * @returns {string}
 */
Gui.Timer.View.List.Timer.prototype.addStartDate = function () {

    var date = this.getStartDate(), string = '';

    string += this.helper().getWeekDay(date, true) + '. ' + this.helper().getDateString(date, true);

    return string;
};

/**
 * retrieve time as string
 * @returns {string}
 */
Gui.Timer.View.List.Timer.prototype.addTime = function () {

    var start = this.getStartDate(), end = this.getEndDate(), string = '';

    string += this.helper().getTimeString(start) +' - '+ this.helper().getTimeString(end);

    return string;
};
