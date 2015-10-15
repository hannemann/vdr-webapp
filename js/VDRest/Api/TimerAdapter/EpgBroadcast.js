/**
 * @constructor
 */
VDRest.Api.TimerAdapter.EpgBroadcast = function () {};

/**
 * @type {VDRest.Api.TimerAdapter.Abstract}
 */
VDRest.Api.TimerAdapter.EpgBroadcast.prototype = new VDRest.Api.TimerAdapter.Abstract();

/**
 * add relevant data
 * @param client
 */
VDRest.Api.TimerAdapter.EpgBroadcast.prototype.setData = function (client) {

    this.timer = {
        "id" : client.data.timer_id,
        "is_active" : !client.data.timer_id ? true : client.data.timer_active,
        "channel" : client.data.channel
    };
    this.broadcast = client.data;

    return this;
};

/**
 * convert data
 * @returns {VDRest.Api.TimerAdapter.EpgBroadcast}
 */
VDRest.Api.TimerAdapter.EpgBroadcast.prototype.normalize = function () {

//    VDRest.helper.log(obj);

    var times = this.getTimes({

        "start_time" : this.broadcast.start_date,

        "vps" : this.broadcast.vps,

        "duration" : this.broadcast.duration
    });

    this.flags = this.getFlags();

    this.weekdays = '-------';

    this.timer_id = this.broadcast.timer_id;

    this.start = times.start;

    this.stop = times.stop;

    this.day = times.day;

    this.file = this.broadcast.title;

    this.channel = this.broadcast.channel;

    this.aux = this.broadcast.channel + '/' + this.broadcast.id + ':';

    return this;
};