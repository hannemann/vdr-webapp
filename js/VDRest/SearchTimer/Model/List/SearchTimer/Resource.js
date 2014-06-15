/**
 * Channels resource
 * @constructor
 */
VDRest.SearchTimer.Model.List.SearchTimer.Resource = function () {};

/**
 * @type {VDRest.Api.Resource}
 */
VDRest.SearchTimer.Model.List.SearchTimer.Resource.prototype = new VDRest.Api.Resource();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.SearchTimer.Model.List.SearchTimer.Resource.prototype._class = 'VDRest.SearchTimer.Model.List.SearchTimer.Resource';

/**
 * url store
 * @type {{channelList: string}}
 */
VDRest.SearchTimer.Model.List.SearchTimer.Resource.prototype.urls = {

    "delete" : "SearchTimers",
    "searchTimerList" : "searchtimers.json"
};

/**
 * create or update SearchTimer
 * @param adapter
 * @param {string} callerId     cacheKey id of broadcast
 * @param {function} [callback]
 */
VDRest.SearchTimer.Model.List.SearchTimer.Resource.prototype.addOrUpdateSearchTimer = function (adapter, callerId, callback) {

    var method = 'PUT',
        event = 'updated',
        data, request = {};

    data = adapter.getData();

    // set method
    if ("undefined" === typeof data.SearchTimer_id) {

        method = 'POST';
        event = 'created';
    }

    request.url = this.getBaseUrl() + '/SearchTimers';
    request.method = method;
    request.data = data;

    this.fetchAsync(request, function (result) {

        VDRest.helper.log(result);

        $.event.trigger({
            "type" : 'vdrest-api-actions.SearchTimer-' + event,
            "payload" : {
                "callerId" : callerId,
                "SearchTimer" : result.SearchTimers[0]
            }
        });

        if ("function" === typeof callback) {

            callback();
        }
    });
};

/**
 * delete SearchTimer
 * @param adapter
 */
VDRest.SearchTimer.Model.List.SearchTimer.Resource.prototype.deleteSearchTimer = function (adapter) {

    var url, data, request = {}, me = this;

    data = adapter.getData();

    url = this.getBaseUrl() + '/SearchTimers/' + data.SearchTimer_id;

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "type" : "Confirm",
            "data" : {
                "message" : "Delete SearchTimer?",
                "id" : 'delete.SearchTimer' + data.SearchTimer_id
            }
        }
    });

    $(document).one('window.confirm.confirm', function () {

        request.url = url;
        request.method = 'DELETE';

        setTimeout(function () {

            me.fetchAsync(request, function () {

                $.event.trigger({
                    "type" : "vdrest-api-actions.SearchTimer-deleted",
                    "payload" : data.SearchTimer_id
                });
            });

        }, 100);
    });
};

/**
 * set url needed to retrieve specific SearchTimer
 * @param id
 * @returns {VDRest.SearchTimer.Model.List.SearchTimer.Resource}
 */
VDRest.SearchTimer.Model.List.SearchTimer.Resource.prototype.setIdUrl = function (id) {

    this.urls.byId = 'SearchTimers/' + id + '.json';

    return this;
};
