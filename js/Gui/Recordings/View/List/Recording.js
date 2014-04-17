
Gui.Recordings.View.List.Recording = function () {};

Gui.Recordings.View.List.Recording.prototype = new VDRest.Abstract.View();

Gui.Recordings.View.List.Recording.prototype.cacheKey = 'number';

Gui.Recordings.View.List.Recording.prototype.init = function () {

    this.node = $('<div class="timer list-item clearer">');

    this.date = $('<span class="date">').appendTo(this.node);
//
//    this.channel = $('<span class="channel">').appendTo(this.node);
//
//    this.time = $('<span class="time">').appendTo(this.node);

    this.name = $('<div class="name">').appendTo(this.node);
};

Gui.Recordings.View.List.Recording.prototype.render = function () {

//    this.channel.text(this.getChannelName());

    this.name.text(this.getName());

    this.date.text(this.addStartDate());

//    this.time.text(this.addTime());

    VDRest.Abstract.View.prototype.render.call(this);
};

Gui.Recordings.View.List.Recording.prototype.addStartDate = function () {

    var date = new Date(this.getEventStartTime()*1000), string = '';

    string += this.helper().getWeekDay(date) + ' ' + this.helper().getDateString(date);

    return string;
};

Gui.Recordings.View.List.Recording.prototype.addTime = function () {

    var start = this.getStartDate(), end = this.getEndDate(), string = '';

    string += this.helper().getTimeString(start) +' - '+ this.helper().getTimeString(end);

    return string;
};
