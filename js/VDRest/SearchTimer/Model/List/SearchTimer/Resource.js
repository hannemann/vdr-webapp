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
    "searchTimerList" : "searchtimers.json"
};

/**
 * url store
 * @type {{channelList: string}}
 */
VDRest.SearchTimer.Model.List.SearchTimer.Resource.prototype.callbackEvents = [
    'vdrest-api-actions.SearchTimer-updated',
    'vdrest-api-actions.SearchTimer-created',
    'vdrest-api-actions.SearchTimer-deleted'
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

VDRest.SearchTimer.Model.List.SearchTimer.Resource.prototype.toggleActive = function (id) {

    var model = VDRest.app.getModule('VDRest.SearchTimer').getModel('List.SearchTimer', id);

    model.data.use_as_searchtimer = model.data.use_as_searchtimer == 0 ? 1 : 0;
    model.save();
};

/**
 * delete SearchTimer
 * @param {number} id
 */
VDRest.SearchTimer.Model.List.SearchTimer.Resource.prototype.deleteSearchTimer = function (id) {

    var url = this.getBaseUrl() + this.urls.delete + id,
        request = {};

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "type" : "Confirm",
            "data" : {
                "message" : "Delete SearchTimer?",
                "id": 'delete.SearchTimer' + id
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
                    "payload": id
                });
            });

        }.bind(this), 100);
    }.bind(this));
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

VDRest.SearchTimer.Model.List.SearchTimer.Resource.prototype.onError = function (e) {

    $window.off(this.callbackEvents.join(' '));
    VDRest.Api.Resource.prototype.onError.call(this, e);
};
