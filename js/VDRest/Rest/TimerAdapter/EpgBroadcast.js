/**
 * @constructor
 */
VDRest.Rest.TimerAdapter.EpgBroadcast = function () {};

/**
 * @type {VDRest.Rest.TimerAdapter.Abstract}
 */
VDRest.Rest.TimerAdapter.EpgBroadcast.prototype = new VDRest.Rest.TimerAdapter.Abstract();

/**
 * convert data
 * @param {VDRest.Epg.Model.Channels.Channel.Broadcast} obj
 * @returns {VDRest.Rest.TimerAdapter.EpgBroadcast}
 */
VDRest.Rest.TimerAdapter.EpgBroadcast.prototype.normalize = function (obj) {

//    VDRest.helper.log(obj);

    var times = this.getTimes({

        "start_time" : new Date(obj.getData('start_date')),

        "vps" : 0, // TODO: read from object as soon as available

        "duration" : obj.getData('duration')
    });

    this.flags = this.getFlags({
        "is_active" : 1,
        "vps" : 0 //obj.data.resource.vps
    });

    this.weekdays = '-------';

    this.timer_id = obj.getData('timer_id');

    this.start = times.start;

    this.stop = times.stop;

    this.day = times.day;

    this.file = obj.getData('title');

    this.channel = obj.getData('channel');

    this.aux = obj.keyInCache;

    return this;
};