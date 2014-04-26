VDRest.Rest.Actions = function () {};

VDRest.Rest.Actions.prototype = new VDRest.Rest.Api();

VDRest.Rest.Actions.prototype.urls = {};

VDRest.Rest.Actions.prototype.addTimer = function (obj) {
    var url, data;

    url = this.getBaseUrl() + '/timers';

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

            var model, collection = VDRest.app.getModule('VDRest.Timer').getModel('List').getCollection();

            obj.setData('timer_exists', true);
            obj.setData('timer_active', result.timers[0].is_active);
            obj.setData('timer_id', result.timers[0].id);

            result.timers[0].event_id = obj.getData('id');

            model = VDRest.app.getModule('VDRest.Timer').getModel('List.Timer', result.timers[0]);

            if (collection.length > 0) {

                collection.push(model);
                collection.sort(VDRest.Timer.Model.List.prototype.sortByTime);
            }

            $.event.trigger({
                "type" : 'timer-changed.' + obj.keyInCache
            });

        }, this),
        "complete":function (result) {
            VDRest.helper.log(obj, result);
        }
    });
};

VDRest.Rest.Actions.prototype.updateTimer = function (obj) {
    var url, data, weekdays, start, stop, day;

    start = new Date(obj.event.start_time * 1000);
    stop = new Date(obj.event.start_time * 1000 + obj.event.duration * 1000);
    weekdays = helper.getWeekDay(start);

    day = start.getFullYear() + '-' + helper.pad(start.getMonth()+1, 2) + '-'+ helper.pad(start.getDate(), 2);

    start.setTime(start.getTime()-1000*parseInt(VDRest.config.getItem('recordingStartGap'), 10));
    stop.setTime(stop.getTime()+1000*parseInt(VDRest.config.getItem('recordingEndGap'), 10));

    start = helper.pad(start.getHours(), 2) + helper.pad(start.getMinutes(), 2);
    stop = helper.pad(stop.getHours(), 2) + helper.pad(stop.getMinutes(), 2);

    url = this.getBaseUrl() + '/timers';

    data = {
        "file":encodeURIComponent(obj.event.title),
        "stop":stop,
        "start":start,
        "day":day,
        "channel":obj.event.channel,
        "weekdays":'',
        "flags":1
    };

    console.log(data);

//    $.ajax({
//        "url":url,
//        "data":data,
//        "type":"PUT",
//        "success":$.proxy(function (result) {
//
//            var model, collection = VDRest.app.getModule('VDRest.Timer').getModel('List').getCollection();
//
//            obj.setData('timer_exists', true);
//            obj.setData('timer_active', result.timers[0].is_active);
//            obj.setData('timer_id', result.timers[0].id);
//
//            model = VDRest.app.getModule('VDRest.Timer').getModel('List.Timer', result.timers[0]);
//
//            if (collection.length > 0) {
//
//                collection.push(model);
//                collection.sort(VDRest.Timer.Model.List.prototype.sortByTime);
//            }
//
//            $.event.trigger({
//                "type" : 'timer-changed.' + obj.keyInCache
//            });
//
//        }, this),
//        "complete":function (result) {
//            VDRest.helper.log(obj, result);
//        }
//    });
};

VDRest.Rest.Actions.prototype.deleteTimer = function (obj) {

    var timer_id, url, broadcast;

    if (obj instanceof VDRest.Epg.Model.Channels.Channel.Broadcast) {

        timer_id = obj.getData('timer_id');
        broadcast = obj;

    } else if (obj instanceof Gui.Window.Controller.TimerEdit) {

        timer_id = obj.keyInCache;
        broadcast = obj.broadcast;
    }

    url = this.getBaseUrl() + '/timers/' + timer_id;

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "type" : "Confirm",
            "data" : {
                "message" : "Delete Timer?",
                "id" : 'delete.timer' + timer_id
            }
        }
    });

    $(document).one('window.confirm.confirm', function () {

        setTimeout(function () {
            $.ajax({
                "url":url,
                "type":"DELETE",
                "success": function () {

                    var model;

                    broadcast.setData('timer_exists', false);
                    broadcast.setData('timer_active', false);
                    broadcast.setData('timer_id', '');

                    model = VDRest.app.getModule('VDRest.Timer').getModel('List.Timer', timer_id);
                    VDRest.app.getModule('VDRest.Timer').getModel('List').deleteFromCollection(model);
                    delete model.cache[model.keyInCache];

                    $.event.trigger({
                        "type" : 'timer-changed.' + obj.keyInCache,
                        "state" : "deleted"
                    });
                },
                "complete":function (result) {
                    VDRest.helper.log(obj, result);
                }
            });
        }, 100);
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

    var message = obj.getEventTitle();

    message += obj.hasEventShortText() ? ' - ' + obj.getEventShortText() : '';

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "type" : "Confirm",
            "data" : {
                "message" : "Delete Recording '" + message + "'?",
                "id" : 'delete.recording' + obj.getNumber()
            }
        }
    });

    $(document).one('window.confirm.confirm', $.proxy(function () {

        $.ajax({
            "url":this.getBaseUrl() + 'recordings/' + obj.getNumber(),
            "type":"DELETE",
            "success":function () {
                if (typeof callback == 'function') {

                    callback();
                }
            },
            "complete":function (result) {
                VDRest.helper.log(obj, result);
            }
        });

    }, this));

};

VDRest.Rest.actions = new VDRest.Rest.Actions();