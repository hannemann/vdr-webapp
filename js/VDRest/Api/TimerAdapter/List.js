/**
 * @constructor
 */
VDRest.Api.TimerAdapter.List = function () {};

/**
 * @type {VDRest.Api.TimerAdapter.Abstract}
 */
VDRest.Api.TimerAdapter.List.prototype = new VDRest.Api.TimerAdapter.Abstract();

/**
 * add relevant data
 * @param client
 */
VDRest.Api.TimerAdapter.List.prototype.setData = function (client) {

    this.timer = client.data.dataModel.data;

    return this;
};

/**
 * convert data
 * @returns {VDRest.Api.TimerAdapter.Timer}
 */
VDRest.Api.TimerAdapter.List.prototype.normalize = function () {

    this.weekdays = this.timer.weekdays;

    this.timer_id = this.timer.id;

    this.start = this.timer.start;

    this.stop = this.timer.stop;

    this.day = this.timer.day;

    this.file = this.timer.filename;

    this.channel = this.timer.channel;

    this.flags = this.getFlags();

    this.aux = this.getAux(this.timer);

    return this;
};