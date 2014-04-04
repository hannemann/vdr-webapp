Actions = function () {};

Actions.prototype = new VDRest.Api();

Actions.prototype.urls = {};

Actions.prototype.addTimer = function (obj, callback) {
    var url, data; //, weekdays, start, stop, day;

//    start = new Date(obj.event.start_time * 1000);
//    stop = new Date(obj.event.start_time * 1000 + obj.event.duration * 1000);
//    weekdays = helper.getWeekDay(start);
//
//    day = start.getFullYear() + '-' + helper.pad(start.getMonth()+1, 2) + '-'+ helper.pad(start.getDate(), 2);
//
//    start.setTime(start.getTime()-1000*parseInt(config.getItem('recordingStartGap'), 10));
//    stop.setTime(stop.getTime()+1000*parseInt(config.getItem('recordingEndGap'), 10));
//
//    start = helper.pad(start.getHours(), 2) + helper.pad(start.getMinutes(), 2);
//    stop = helper.pad(stop.getHours(), 2) + helper.pad(stop.getMinutes(), 2);

    url = 'http://'+config.getItem('host')+':'+config.getItem('port')+'/timers';
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
        "channel":obj.getData('channel'),
        "eventid":obj.getData('id'),
        "minpre":config.getItem('recordingStartGap')/60,
        "minpost":config.getItem('recordingEndGap')/60
    };

    $.ajax({
        "url":url,
        "data":data,
        "type":"POST",
        "success":$.proxy(function (result) {

            var id = obj.getData('dom').attr('id'),
                epgEvent = VDRest.app.getModule('epg').events[id];

            obj.setData('timer_active', true);
            obj.setData('timer_exists', true);
            obj.setData('timer_id', result.timers[0].id);

            obj.getData('dom').addClass('active-timer');
            epgEvent.timer_active =  true;
            epgEvent.timer_exists = true;
            epgEvent.timer_id = result.timers[0].id;

            VDRest.app.getModule('timers').refreshCache = true;
            if (typeof callback == 'function') {

                callback.apply(obj);
            }
        }, this),
        "complete":function (result) {
            helper.log(obj, result);
        }
    });
};

Actions.prototype.deleteTimer = function (obj, callback) {
    var url = 'http://'+config.getItem('host')+':'+config.getItem('port')+'/timers/'+obj.getData('timer_id');

    $.ajax({
        "url":url,
        "type":"DELETE",
        "success":$.proxy(function () {

            var id = obj.getData('dom').attr('id'),
                epgEvent = VDRest.app.getModule('epg').events[id];

            obj.setData('timer_active', false);
            obj.setData('timer_exists', false);
            obj.setData('timer_id', '');

            obj.getData('dom').removeClass('active-timer');
            epgEvent.timer_active = false;
            epgEvent.timer_exists = false;
            epgEvent.timer_id = '';

            VDRest.app.getModule('timers').refreshCache = true;

            if (typeof callback == 'function') {

                callback.apply(obj);
            }
        }, this),
        "complete":function (result) {
            helper.log(obj, result);
        }
    });
};

Actions.prototype.loadTimer = function (obj) {
    $.ajax({
        "url":"http://"+config.getItem('host')+':'+config.getItem('port')+"/timers/"+obj.getData('timer_id')+'.json',
        "success":function (result) {
            obj.timer = result.timers[0];
        }
    });
};

Actions.prototype.deleteRecording = function (obj, callback) {

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

actions = new Actions();