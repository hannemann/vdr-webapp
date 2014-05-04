/**
 * @constructor
 */
VDRest.Api.TimerAdapter.Timer = function () {};

/**
 * @type {VDRest.Api.TimerAdapter.Abstract}
 */
VDRest.Api.TimerAdapter.Timer.prototype = new VDRest.Api.TimerAdapter.Abstract();

/**
 * add relevant data
 * @param client
 */
VDRest.Api.TimerAdapter.Timer.prototype.setData = function (client) {

    this.timer = client.data.resource;
    this.broadcast = client.broadcast.data;

    return this;
};

/**
 * convert data
 * @returns {VDRest.Api.TimerAdapter.Timer}
 */
VDRest.Api.TimerAdapter.Timer.prototype.normalize = function () {

    this.weekdays = this.timer.weekdays;

    this.timer_id = this.timer.id;

    this.start = this.timer.start;

    this.stop = this.timer.stop;

    this.day = this.timer.day;

    this.file = this.timer.filename;

    this.channel = this.timer.channel;

    this.flags = this.getFlags();

    this.aux = this.broadcast.channel && this.broadcast.channel + '/' + this.broadcast.id + ':' || '';

    return this;
};