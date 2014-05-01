VDRest.Api.TimerAdapter.Abstract = function () {};

VDRest.Api.TimerAdapter.Abstract.prototype = {

    "errorMessage" : '',

    "weekdays" : /^[-M][-T][-W][-T][-F][-S][-S]$/,

    "timer_id" : /^([0-9]+)?$/,

    "start" : /^[0-9]{4}$/,

    "stop" : /^[0-9]{4}$/,

    "day" : /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,

    "file" : String(),

    "channel" : /^[-A-Z0-9]$/,

    "flags" : Number(),

    "aux" : String(),

    "validateProperties" : function () {


    },

    "getTimes" : function (obj) {

        var times = {}, day = [], start, stop;

        // if not vps add gaps
        if (1==2 && obj.vps > 0 && VDRest.config.getItem('autoVps')) {

            times.start = new Date(obj.vps * 1000);

        } else {

            start = new Date(
                obj.start_time.getTime()
                - 1000 * parseInt(VDRest.config.getItem('recordingStartGap'), 10)
            );

            times.start = VDRest.helper.pad(start.getHours(), 2) + VDRest.helper.pad(start.getMinutes(), 2);
        }

        stop = new Date(
            obj.start_time.getTime() + obj.duration * 1000
            + 1000 * parseInt(VDRest.config.getItem('recordingEndGap'), 10)
        );

        times.stop = VDRest.helper.pad(stop.getHours(), 2) + VDRest.helper.pad(stop.getMinutes(), 2);

        // create day
        day.push(start.getFullYear());
        day.push(VDRest.helper.pad(start.getMonth()+1, 2));
        day.push(VDRest.helper.pad(start.getDate(), 2));

        times.day = day.join('-');

        return times;
    },

    "getFlags" : function (obj) {

        flags = 0;

        flags += obj.is_active ? 1 : 0;

        flags += obj.vps > 0 ? 4 : 0;

        // i guess its not needed here
//        flags += obj.is_recording ? 8 : 0;

        return flags;
    },

    "getData" : function () {

        var data = {};

        data.weekdays = this.weekdays;

        if (this.timer_id) {

            data.timer_id = this.timer_id;
        }

        data.start = this.start;

        data.stop = this.stop;

        data.day = this.day;

        data.file = this.file;

        data.channel = this.channel;

        data.flags = this.flags;

        data.aux = this.aux;

        return data;
    }
};