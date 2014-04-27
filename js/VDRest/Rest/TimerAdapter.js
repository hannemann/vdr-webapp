VDRest.Rest.TimerAdapter = function (obj) {

    if (obj instanceof VDRest.Epg.Model.Channels.Channel.Broadcast) {

        this.normalizeBroadcast(obj);

    } else {

        if (!this.validateProperties(obj)) {

            throw new TypeError('Timer data mismatch: ' + this.errorMessage);
        }
    }

    return this.getData();
};

VDRest.Rest.TimerAdapter.prototype = {

    "errorMessage" : '',

    "weekdays" : /^[-M][-T][-W][-T][-F][-S][-S]$/,

    "timer_id" : /^([0-9]+)?$/,

    "start" : /^[0-9]{4}$/,

    "stop" : /^[0-9]{4}$/,

    "day" : /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,

    "file" : String(),

    "channel" : /^[-A-Z0-9]$/,

    "flags" : Number(),

    /**
     * create timer data from broadcast object
     * @param obj
     */
    "normalizeBroadcast" : function (obj) {

        VDRest.helper.log(obj);

        var start, stop, day = [];

        // if not vps add gaps
        if (1==2 && obj.getData('vps') > 0 && VDRest.config.getItem('autoVps')) {

            start = new Date(obj.getData('vps') * 1000);

            this.flags = '5';

        } else {

            start = new Date(
                obj.getData('start_time') * 1000
                - 1000 * parseInt(VDRest.config.getItem('recordingStartGap'), 10)
            );

            this.flags = '1';
        }

        stop = new Date(
            obj.getData('start_time') * 1000 + obj.getData('duration') * 1000
            + 1000 * parseInt(VDRest.config.getItem('recordingEndGap'), 10)
        );

        this.weekdays = '-------';

        this.timer_id = undefined;

        this.start = VDRest.helper.pad(start.getHours(), 2) + VDRest.helper.pad(start.getMinutes(), 2);

        this.stop = VDRest.helper.pad(stop.getHours(), 2) + VDRest.helper.pad(stop.getMinutes(), 2);

        // create day
        day.push(start.getFullYear());
        day.push(VDRest.helper.pad(start.getMonth()+1, 2));
        day.push(VDRest.helper.pad(start.getDate(), 2));

        this.day = day.join('-');

        this.file = obj.getData('title');

        this.channel = obj.getData('channel');
    },

    "validateProperties" : function () {


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

        return data;
    }
};