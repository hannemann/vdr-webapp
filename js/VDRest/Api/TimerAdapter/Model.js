/**
 * @constructor
 */
VDRest.Api.TimerAdapter.Model = function () {};

/**
 * @type {VDRest.Api.TimerAdapter.Abstract}
 */
VDRest.Api.TimerAdapter.Model.prototype = new VDRest.Api.TimerAdapter.Abstract();

/**
 * add relevant data
 * @param client
 */
VDRest.Api.TimerAdapter.Model.prototype.setData = function (client) {

    this.timer = client.data.timer.data;
    delete client.data.timer;
    this.broadcast = client.data;

    return this;
};

/**
 * convert data
 * @returns {VDRest.Api.TimerAdapter.Model}
 */
VDRest.Api.TimerAdapter.Model.prototype.normalize = function () {

//    VDRest.helper.log(obj);

    this.flags = this.getFlags();

    this.weekdays = this.timer.weekdays;

    this.timer_id = this.timer.id;

    this.start = this.timer.start;

    this.stop = this.timer.stop;

    this.day = this.timer.day;

    this.file = this.timer.filename;

    this.channel = this.timer.channel;

    this.is_active = this.timer.is_active;

    this.aux = this.getAux(this.timer);

    return this;
};