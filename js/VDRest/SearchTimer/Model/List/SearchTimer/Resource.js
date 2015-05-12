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

    "delete": "searchtimers/",
    "searchTimerList": "searchtimers.json",
    "search": "searchtimers/search/",
    "update": "searchtimers/update"
};

/**
 * url store
 * @type {{channelList: string}}
 */
VDRest.SearchTimer.Model.List.SearchTimer.Resource.prototype.callbackEvents = [
    'vdrest-api-actions.SearchTimer-updated',
    'vdrest-api-actions.SearchTimer-created',
    'vdrest-api-actions.SearchTimer-deleted',
    'vdrest-api-actions.SearchTimer-test',
    'vdrest-api-actions.SearchTimer-update-triggered'
];

/**
 * create or update SearchTimer
 * @param {{}} data
 * @param {function} [callback]
 */
VDRest.SearchTimer.Model.List.SearchTimer.Resource.prototype.addOrUpdateSearchTimer = function (data, callback) {

    var method = 'POST',
        event = 'updated',
        request = {}, id = data.id;

    // set event
    if (id < 0) {

        event = 'created';
    }

    request.url = this.getBaseUrl() + 'searchtimers';
    request.method = method;
    request.data = data;

    this.fetchAsync(request, function (result, xhr) {

        VDRest.helper.log(result);

        if ('created' === event) {
            id = xhr.statusText.replace(/[^0-9]/g, '');
            if (id != '') {
                id = parseInt(id, 10);
            }
        }

        $.event.trigger({
            "type": 'vdrest-api-actions.SearchTimer-' + event,
            "payload": {
                "id": id
            }
        });

        if ("function" === typeof callback) {

            callback();
        }
    });
};

/**
 * delete SearchTimer
 * @param {{}} data
 */
VDRest.SearchTimer.Model.List.SearchTimer.Resource.prototype.deleteSearchTimer = function (data) {

    var url = this.getBaseUrl() + this.urls.delete + data.id,
        request = {};

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "type" : "Confirm",
            "data" : {
                "message": VDRest.app.translate("Delete SearchTimer \"%s\"?", data.search),
                "id": 'delete.SearchTimer' + data.id
            }
        }
    });

    $(document).one('window.confirm.confirm', function () {

        request.url = url;
        request.method = 'DELETE';

        setTimeout(function () {

            this.fetchAsync(request, function () {

                $.event.trigger({
                    "type" : "vdrest-api-actions.SearchTimer-deleted",
                    "payload": data.id
                });
            });

        }.bind(this), 100);
    }.bind(this));
};

/**
 * test SearchTimer
 * @param {VDRest.SearchTimer.Model.List.SearchTimer} model
 */
VDRest.SearchTimer.Model.List.SearchTimer.Resource.prototype.performSearch = function (model) {

    var
        request = {
            "url": this.getBaseUrl() + this.urls.search + model.data.id + '.json',
            "method": 'GET'
        };

    this.fetchAsync(request, function (result) {

        $.event.trigger({
            "type": "vdrest-api-actions.SearchTimer-test",
            "payload": result
        });
    });
};

/**
 * test SearchTimer
 */
VDRest.SearchTimer.Model.List.SearchTimer.Resource.prototype.triggerUpdate = function () {

    var
        request = {
            "url": this.getBaseUrl() + this.urls.update,
            "method": 'POST'
        };

    this.fetchAsync(request, function () {

        $.event.trigger({
            "type": "vdrest-api-actions.SearchTimer-update-triggered"
        });
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

/**
 * handle error
 * @param e
 */
VDRest.SearchTimer.Model.List.SearchTimer.Resource.prototype.onError = function (e) {

    $window.off(this.callbackEvents.join(' '));
    VDRest.Api.Resource.prototype.onError.call(this, e);
};
