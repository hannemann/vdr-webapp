VDRest.Api.Actions = function () {};

VDRest.Api.Actions.prototype = new VDRest.Api.Resource();

/**
 * create or update timer
 * @param adapter
 * @param {string} callerId     cacheKey id of broadcast
 */
VDRest.Api.Actions.prototype.addOrUpdateTimer = function (adapter, callerId) {

    var method = 'PUT',
        event = 'updated',
        data;

    data = adapter.getData();

    // set method
    if ("undefined" === typeof data.timer_id) {

        method = 'POST';
        event = 'created';
    }

    $.ajax({
        "url" : this.getBaseUrl() + '/timers',
        "data" : data,
        "type" : method,
        "success":$.proxy(function (result) {

            $.event.trigger({
                "type" : 'vdrest-api-actions.timer-' + event,
                "payload" : {
                    "broadcastId" : callerId,
                    "timer" : result.timers[0]
                }
            });

        }, this),
        "complete":function (result) {
//            VDRest.helper.log(obj, result);
        }
    });
};

/**
 * delete timer
 * @param adapter
 */
VDRest.Api.Actions.prototype.deleteTimer = function (adapter) {

    var url, data;

    data = adapter.getData();

    url = this.getBaseUrl() + '/timers/' + data.timer_id;

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "type" : "Confirm",
            "data" : {
                "message" : "Delete Timer?",
                "id" : 'delete.timer' + data.timer_id
            }
        }
    });

    $(document).one('window.confirm.confirm', function () {

        setTimeout(function () {
            $.ajax({
                "url" : url,
                "type" : "DELETE",
                "success": function () {

                    $.event.trigger({
                        "type" : "vdrest-api-actions.timer-deleted",
                        "payload" : data.timer_id
                    });
                },
                "complete":function (result) {
//                    VDRest.helper.log(adapter, result);
                }
            });
        }, 100);
    });
};

/**
 * delete recording
 * @param obj
 * @param callback
 */
VDRest.Api.Actions.prototype.deleteRecording = function (obj, callback) {

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
//                VDRest.helper.log(obj, result);
            }
        });

    }, this));

};

VDRest.Api.actions = new VDRest.Api.Actions();