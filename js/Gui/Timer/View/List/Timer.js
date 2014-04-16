
Gui.Timer.View.List.Timer = function () {};

Gui.Timer.View.List.Timer.prototype = new VDRest.Abstract.View();

Gui.Timer.View.List.Timer.prototype.cacheKey = 'id';

Gui.Timer.View.List.Timer.prototype.init = function () {

    this.node = $('<div class="timer list-item clearer">');

    this.date = $('<span class="date">').appendTo(this.node);

    this.channel = $('<span class="channel">').appendTo(this.node);

    this.time = $('<span class="time">').appendTo(this.node);

    this.name = $('<div class="filename">').appendTo(this.node);
};

Gui.Timer.View.List.Timer.prototype.render = function () {

    this.channel.text(this.getChannelName());

    this.name.text(this.getFilename());

    this.date.text(this.addStartDate());

    this.time.text(this.addTime());

    VDRest.Abstract.View.prototype.render.call(this);
};

Gui.Timer.View.List.Timer.prototype.addStartDate = function () {

    var date = this.getStartDate(), string = '';

    string += this.helper().getWeekDay(date) + ' ' + this.helper().getDateString(date);

    return string;
};

Gui.Timer.View.List.Timer.prototype.addTime = function () {

    var start = this.getStartDate(), end = this.getEndDate(), string = '';

    string += this.helper().getTimeString(start) +' - '+ this.helper().getTimeString(end);

    return string;
};
