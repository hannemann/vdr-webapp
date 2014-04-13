VDRest.Rest.Actions = function () {};

VDRest.Rest.Actions.prototype = new VDRest.Rest.Api();

VDRest.Rest.Actions.prototype.urls = {};

VDRest.Rest.Actions.prototype.addTimer = function (obj) {
    var url, data; //, weekdays, start, stop, day;

//    start = new Date(obj.event.start_time * 1000);
//    stop = new Date(obj.event.start_time * 1000 + obj.event.duration * 1000);
//    weekdays = helper.getWeekDay(start);
//
//    day = start.getFullYear() + '-' + helper.pad(start.getMonth()+1, 2) + '-'+ helper.pad(start.getDate(), 2);
//
//    start.setTime(start.getTime()-1000*parseInt(VDRest.config.getItem('recordingStartGap'), 10));
//    stop.setTime(stop.getTime()+1000*parseInt(VDRest.config.getItem('recordingEndGap'), 10));
//
//    start = helper.pad(start.getHours(), 2) + helper.pad(start.getMinutes(), 2);
//    stop = helper.pad(stop.getHours(), 2) + helper.pad(stop.getMinutes(), 2);

    url = 'http://'+VDRest.config.getItem('host')+':'+VDRest.config.getItem('port')+'/timers';
//                data = {
//                    "file":encodeURIComponent(obj.event.title),
//                    "stop":stop,
//                    "start":start,
//                    "day":day,
//                    "channel":obj.event.channel,
//                    "weekdays":'',
//                    "flags":1
//                }

    data = {
        "channel" : obj.getData('channel'),
        "eventid" : obj.getData('id'),
        "minpre"  : VDRest.config.getItem('recordingStartGap')/60,
        "minpost" : VDRest.config.getItem('recordingEndGap')/60
    };

    $.ajax({
        "url":url,
        "data":data,
        "type":"POST",
        "success":$.proxy(function (result) {

            obj.setData('timer_exists', true);
            obj.setData('timer_active', result.timers[0].is_active);
            obj.setData('timer_id', result.timers[0].id);

            // TODO: add timer to cache without reloading it
//            VDRest.app.getModule('timers').refreshCache = true;

            $.event.trigger({
                "type" : 'timer-changed.' + obj.keyInCache
            });

        }, this),
        "complete":function (result) {
            VDRest.helper.log(obj, result);
        }
    });
};

VDRest.Rest.Actions.prototype.deleteTimer = function (obj) {

    var url = this.getBaseUrl() + '/timers/' + obj.getData('timer_id');

    $.ajax({
        "url":url,
        "type":"DELETE",
        "success":$.proxy(function () {

            obj.setData('timer_exists', false);
            obj.setData('timer_active', false);
            obj.setData('timer_id', '');

            // TODO: add timer to cache without reloading it
//            VDRest.app.getModule('timers').refreshCache = true;

            $.event.trigger({
                "type" : 'timer-changed.' + obj.keyInCache
            });
        }, this),
        "complete":function (result) {
            VDRest.helper.log(obj, result);
        }
    });
};

//VDRest.Rest.Actions.prototype.loadTimer = function (obj) {
//    $.ajax({
//        "url":"http://"+VDRest.config.getItem('host')+':'+VDRest.config.getItem('port')+"/timers/"+obj.getData('timer_id')+'.json',
//        "success":function (result) {
//            obj.timer = result.timers[0];
//        }
//    });
//};

VDRest.Rest.Actions.prototype.deleteRecording = function (obj, callback) {

    var c = new Gui.Confirm();
    c.dispatch({"message":'Aufnahme löschen?'});

    $(document).one('Gui.Confirm.close', $.proxy(function (e) {

        if (e && e.confirmed) {

            $.ajax({
                "url":this.getBaseUrl() + 'recordings/' + obj.getData('number'),
                "type":"DELETE",
                "success":$.proxy(function () {
                    if (typeof callback == 'function') {
debugger;
                        callback();
                    }
                }, this),
                "complete":function (result) {
                    helper.log(obj, result);
                }
            });
        }

    }, this));

};

VDRest.Rest.actions = new VDRest.Rest.Actions();