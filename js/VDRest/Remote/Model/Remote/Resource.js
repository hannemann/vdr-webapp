/**
 * Remote resource
 * @constructor
 */
VDRest.Remote.Model.Remote.Resource = function () {};

/**
 * @type {VDRest.Api.Resource}
 */
VDRest.Remote.Model.Remote.Resource.prototype = new VDRest.Api.Resource();

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
