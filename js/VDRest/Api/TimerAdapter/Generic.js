/**
 * @constructor
 */
VDRest.Api.TimerAdapter.Generic = function () {};

/**
 * @type {VDRest.Api.TimerAdapter.Abstract}
 */
VDRest.Api.TimerAdapter.Generic.prototype = new VDRest.Api.TimerAdapter.Abstract();

/**
 * add relevant data
 * @param client
 */
VDRest.Api.TimerAdapter.Generic.prototype.setData = function (client) {

    this.timer = client.data;
    this.broadcast = client.broadcast.data;
    this.resource = client.resource;

    return this;
};

/**
 * convert data
 * @returns {VDRest.Api.TimerAdapter.Generic}
 */
VDRest.Api.TimerAdapter.Generic.prototype.normalize = function () {

    this.weekdays = this.timer.weekdays || this.resource.weekdays;

    this.timer_id = this.timer.id || this.resource.id;

    this.start = this.timer.start || this.resource.start;

    this.stop = this.timer.stop || this.resource.stop;

    this.day = this.timer.day || this.resource.day;

    this.file = this.timer.filename || this.resource.filename;

    this.channel = this.timer.channel || this.resource.channel;

    this.flags = this.getFlags();

    this.aux = this.broadcast.channel && this.broadcast.channel + '/' + this.broadcast.id + ':' || '';

    return this;
};