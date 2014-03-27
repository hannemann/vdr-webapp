Actions = function () {};

Actions.prototype.addTimer = function (obj, callback) {
    var url, data, weekdays, start, stop, day;

    start = new Date(obj.event.start_time * 1000);
    stop = new Date(obj.event.start_time * 1000 + obj.event.duration * 1000);
    weekdays = helper.getWeekDay(start);

    day = start.getFullYear() + '-' + helper.pad(start.getMonth()+1, 2) + '-'+ helper.pad(start.getDate(), 2);

    start.setTime(start.getTime()-1000*parseInt(config.getItem('recordingStartGap'), 10));
    stop.setTime(stop.getTime()+1000*parseInt(config.getItem('recordingEndGap'), 10));

    start = helper.pad(start.getHours(), 2) + helper.pad(start.getMinutes(), 2);
    stop = helper.pad(stop.getHours(), 2) + helper.pad(stop.getMinutes(), 2);

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
        "channel":obj.event.channel,
        "eventid":obj.event.id,
        "minpre":config.getItem('recordingStartGap')/60,
        "minpost":config.getItem('recordingEndGap')/60
    }

    $.ajax({
        "url":url,
        "data":data,
        "type":"POST",
        "success":$.proxy(function (result) {
            var timer;
            obj.event.dom.addClass('active-timer');
            timer = result.timers[0];
            obj.timer = timer;
            obj.event.timer_active = true;
            obj.event.timer_exists = true;
            obj.event.timer_id = timer.id;
            if (typeof callback == 'function') {
                callback.apply(obj);
            }
        }, this)
    });
};

Actions.prototype.deleteTimer = function (obj, callback) {
    var url = 'http://'+config.getItem('host')+':'+config.getItem('port')+'/timers/'+obj.timer.id

    $.ajax({
        "url":url,
        "type":"DELETE",
        "success":$.proxy(function () {
            obj.event.dom.removeClass('active-timer');
            obj.timer = undefined;
            obj.event.timer_active = false;
            obj.event.timer_exists = false;
            obj.event.timer_id = '';
            if (typeof callback == 'function') {
                callback.apply(obj);
            }
        }, this)
    });
};

Actions.prototype.loadTimer = function (obj) {
    $.ajax({
        "url":"http://"+config.getItem('host')+':'+config.getItem('port')+"/timers/"+obj.event.timer_id+'.json',
        "success":function (result) {
            obj.timer = result.timers[0];
        }
    });
};

//TODO: Confirm bauen

actions = new Actions();