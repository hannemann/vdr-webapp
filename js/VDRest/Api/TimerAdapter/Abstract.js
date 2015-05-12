/**
 * Abstract TimerAdapter
 * @constructor
 */
VDRest.Api.TimerAdapter.Abstract = function () {};

/**
 *
 * @type {{errorMessage: string, weekdays: RegExp, timer_id: RegExp, start: RegExp, stop: RegExp, day: RegExp, file: string, channel: RegExp, flags: number, aux: string, validateProperties: Function, getTimes: Function, getFlags: Function, getData: Function, getVpsSet: Function}}
 */
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
        if (obj.vps > 0 && VDRest.config.getItem('autoVps')) {

            start = new Date(obj.vps * 1000);

            stop = new Date(obj.start_time.getTime() + obj.duration * 1000);

        } else {

            start = new Date(
                obj.start_time.getTime()
                - 1000 * parseInt(VDRest.config.getItem('recordingStartMargin'), 10)
            );

            stop = new Date(
                obj.start_time.getTime() + obj.duration * 1000
                + 1000 * parseInt(VDRest.config.getItem('recordingEndMargin'), 10)
            );
        }

        times.start = VDRest.helper.pad(start.getHours(), 2) + VDRest.helper.pad(start.getMinutes(), 2);

        times.stop = VDRest.helper.pad(stop.getHours(), 2) + VDRest.helper.pad(stop.getMinutes(), 2);

        // create day
        day.push(start.getFullYear());
        day.push(VDRest.helper.pad(start.getMonth()+1, 2));
        day.push(VDRest.helper.pad(start.getDate(), 2));

        times.day = day.join('-');

        return times;
    },

    "getFlags" : function () {

        var flags = VDRest.Timer.Model.List.Timer.prototype.flags.inactive,
            is_active = VDRest.Timer.Model.List.Timer.prototype.flags.is_active,
            vps = VDRest.Timer.Model.List.Timer.prototype.flags.uses_vps;

        flags = this.timer.is_active && flags | is_active || flags;

        flags = (this.broadcast && this.broadcast.vps > 0 && VDRest.config.getItem('autoVps')) && flags | vps || flags;

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
    },

    "getVpsSet" : function () {

        return this.timer.flags & VDRest.Timer.Model.List.Timer.prototype.flags.uses_vps;
    },

    "getAux": function (timer) {

        var p = new DOMParser(),
            s = new XMLSerializer(),
            x = p.parseFromString(timer.aux, "text/xml"),
            node = x.getElementsByTagName('epgsearch')[0],
            v;

        if (node && this.broadcast && this.broadcast.channel) {
            v = x.getElementsByTagName('channel_id')[0] || x.createElement('channel_id');
            v.textContent = this.broadcast.channel;
            node.appendChild(v);
            return s.serializeToString(x);
        } else if (this.broadcast && this.broadcast.channel) {
            return this.broadcast.channel + '/' + this.broadcast.id;
        } else {
            return '';
        }
    }
};