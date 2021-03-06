/**
 * Remote resource
 * @constructor
 */
VDRest.Remote.Model.Remote.Resource = function () {};

/**
 * @type {VDRest.Api.Resource}
 */
VDRest.Remote.Model.Remote.Resource.prototype = new VDRest.Api.Resource();


//VDRest.Remote.Model.Remote.Resource.prototype.noThrobber = true;

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Remote.Model.Remote.Resource.prototype._class = 'VDRest.Remote.Model.Remote.Resource';

/**
 * urls
 */
VDRest.Remote.Model.Remote.Resource.prototype.urls = {

    "main" : "remote"
};

/**
 * send key press
 * @param {String} key
 */
VDRest.Remote.Model.Remote.Resource.prototype.send = function (key) {

    this.fetchAsync({
            "method" : "POST",
            "url" : this.getBaseUrl() + this.urls.main + '/' + key
        },function () {
            $.event.trigger({
                "type" : "remotekeypress"
            });
        }
    );
};

/**
 * send key press
 * @param {String} key
 */
VDRest.Remote.Model.Remote.Resource.prototype.sendKbd = function (key) {

    var data = JSON.stringify({"kbd":key});

    this.fetchAsync({
            "method" : "POST",
            "url" : this.getBaseUrl() + this.urls.main + '/kbd',
            "data" : data,
            "dataType" : 'json'
        },function () {
            $.event.trigger({
                "type" : "remotekeypress"
            });
        }
    );
};

/**
 * send key press
 * @param {String} key
 */
VDRest.Remote.Model.Remote.Resource.prototype.sendSeq = function (key) {

    var data = JSON.stringify({"seq":key});

    this.fetchAsync({
            "method" : "POST",
            "url" : this.getBaseUrl() + this.urls.main + '/seq',
            "data" : data,
            "dataType" : 'json'
        },function () {
            $.event.trigger({
                "type" : "remotekeypress"
            });
        }
    );
};

VDRest.Remote.Model.Remote.Resource.prototype.onError = function (e) {

    if (!e.status || (e.status && e.status != 200)) {
        VDRest.Api.Resource.onError.call(this, arguments)
    }
};
