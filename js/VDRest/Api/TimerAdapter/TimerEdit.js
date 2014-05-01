/**
 * @constructor
 */
VDRest.Api.TimerAdapter.TimerEdit = function () {};

/**
 * @type {VDRest.Api.TimerAdapter.Abstract}
 */
VDRest.Api.TimerAdapter.TimerEdit.prototype = new VDRest.Api.TimerAdapter.Abstract();

/**
 * convert data
 * @param obj {Gui.Window.Controller.TimerEdit}
 * @returns {VDRest.Api.TimerAdapter.TimerEdit}
 */
VDRest.Api.TimerAdapter.TimerEdit.prototype.normalize = function (obj) {

    var duration = new Date(
                new Date(obj.data.resource.stop_timestamp).getTime() - VDRest.config.getItem('recordingEndGap') * 1000
                - new Date(obj.data.resource.start_timestamp).getTime() + VDRest.config.getItem('recordingStartGap') * 1000
            ).getTime() / 1000,

        times = this.getTimes({

            "start_time" : new Date(
                new Date(obj.data.resource.start_timestamp).getTime()
                + VDRest.config.getItem('recordingStartGap') * 1000
            ),

            "vps" : 0, // TODO: read from object as soon as available

            "duration" : duration
        }),

        flags = this.getFlags({
            "is_active" : obj.data.resource.is_active,
            "vps" : 0 //obj.data.resource.vps
        });

    this.weekdays = obj.data.resource.weekdays;

    this.timer_id = obj.data.resource.id;

    this.start = times.start;

    this.stop = times.stop;

    this.day = times.day;

    this.file = obj.data.resource.filename;

    this.channel = obj.data.resource.channel;

    this.flags = flags;

    this.aux = '';

    return this;
};