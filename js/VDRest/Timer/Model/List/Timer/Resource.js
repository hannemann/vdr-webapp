/**
 * Channels resource
 * @constructor
 */
VDRest.Timer.Model.List.Timer.Resource = function () {};

/**
 * @type {VDRest.Api.Resource}
 */
VDRest.Timer.Model.List.Timer.Resource.prototype = new VDRest.Api.Resource();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Timer.Model.List.Timer.Resource.prototype._class = 'VDRest.Timer.Model.List.Timer.Resource';

/**
 * url store
 * @type {{channelList: string}}
 */
VDRest.Timer.Model.List.Timer.Resource.prototype.urls = {

    "delete" : "timers",
    "timerList": "timers.json",
    "bulkDelete": "timers/bulkdelete.json"
};

/**
 * create or update timer
 * @param adapter
 * @param {string} callerId     cacheKey id of broadcast
 * @param {function} [callback]
 */
VDRest.Timer.Model.List.Timer.Resource.prototype.addOrUpdateTimer = function (adapter, callerId, callback) {

    var method = 'PUT',
        event = 'updated',
        data, request = {};

    data = adapter.getData();

    // set method
    if ("undefined" === typeof data.timer_id) {

        method = 'POST';
        event = 'created';
    }

    request.url = this.getBaseUrl() + 'timers';
    request.method = method;
    request.data = data;

    this.fetchAsync(request, function (result) {

        VDRest.helper.log(result);

        $.event.trigger({
            "type" : 'vdrest-api-actions.timer-' + event,
            "payload" : {
                "callerId" : callerId,
                "timer" : result.timers[0]
            }
        });

        if ("function" === typeof callback) {

            callback();
        }
    });
};

/**
 * delete timer
 * @param adapter
 */
VDRest.Timer.Model.List.Timer.Resource.prototype.deleteTimer = function (adapter) {

    var url, data, request = {}, me = this;

    data = adapter.getData();

    url = this.getBaseUrl() + 'timers/' + data.timer_id;

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "type" : "Confirm",
            "data" : {
                "message": VDRest.app.translate("Delete Timer") + '?',
                "id" : 'delete.timer' + data.timer_id
            }
        }
    });

    $document.one('window.confirm.confirm', function () {

        request.url = url;
        request.method = 'DELETE';

        setTimeout(function () {

            me.fetchAsync(request, function () {

                $.event.trigger({
                    "type" : "vdrest-api-actions.timer-deleted",
                    "payload" : data.timer_id
                });
            });

        }, 100);
    });
};

/**
 * bulk delete timer with given ids
 * @param {[]} ids
 */
VDRest.Timer.Model.List.Timer.Resource.prototype.bulkDelete = function (ids) {

    var url, request = {}, me = this;

    url = this.getBaseUrl() + this.urls.bulkDelete;

    $.event.trigger({
        "type": "window.request",
        "payload": {
            "type": "Confirm",
            "data": {
                "message": VDRest.app.translate("Bulk Delete Timer") + '?',
                "id": 'bulkdelete.timer'
            }
        }
    });

    $document.one('window.confirm.confirm', function () {

        request.url = url;
        request.method = 'DELETE';
        request.data = {
            "timers": ids
        };

        setTimeout(function () {

            me.fetchAsync(request, function (result) {

                $.event.trigger({
                    "type": "vdrest-api-actions.timer-bulkdeleted",
                    "payload": result
                });
            });

        }, 100);
    });
};

/**
 * set url needed to retrieve specific timer
 * @param id
 * @returns {VDRest.Timer.Model.List.Timer.Resource}
 */
VDRest.Timer.Model.List.Timer.Resource.prototype.setIdUrl = function (id) {

    this.urls.byId = 'timers/' + id + '.json';

    return this;
};

VDRest.Timer.Model.List.Timer.Resource.prototype.onError = function (e) {

    $window.off("vdrest-api-actions.timer-bulkdeleted");
    VDRest.Api.Resource.prototype.onError.call(this, e);
};
