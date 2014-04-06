VDRest.Rest.Api = function () {

    /**
     * @type {Object}
     */
    this.responseCache = {};

    /**
     * @type {Boolean}
     */
    this.cacheResponse = false;

    /**
     * @type {Boolean}
     */
    this.refreshCache = false;

    /**
     * @type {Boolean}
     */
    this.cachedResponse = false;
};

VDRest.Rest.Api.prototype = new VDRest.Lib.Object();

/**
 * @type {String}
 */
VDRest.Rest.Api.prototype.host = VDRest.config.getItem('host');

/**
 * @type {int}
 */
VDRest.Rest.Api.prototype.port = VDRest.config.getItem('port');

/**
 * @type {String}
 */
VDRest.Rest.Api.prototype.protocol = VDRest.config.getItem('protocol');

/**
 * @type {string}
 */
VDRest.Rest.Api.prototype.getBaseUrl = function () {

    return this.protocol + '://' + this.host + ':' + this.port + '/';
};

/**
 * fetch data from VDRest.Rest.Api api
 * @param url {string}
 * @param [method] {string}
 * @param [callback] {Function}
 */
VDRest.Rest.Api.prototype.load = function (options) {

    var url = "undefined" !== typeof options.url && "undefined" !== typeof this.urls[options.url] ?
        this.urls[options.url] : this.urls.load,

        method = options.method || 'GET',

        callback = options.callback || undefined;

    VDRest.app.getModule('gui').showThrobber();

    if ("function" !== typeof callback) {

        callback = this.onSuccess;
    }

    if (!this.refreshCache && this.cacheResponse && "undefined" !== typeof this.responseCache[url]) {

        this.cachedResponse = true;
        callback(this.responseCache[url]);
        this.onComplete();

    } else {

        this.cachedResponse = false;
        this.refreshCache = false;
        $.ajax({
            "url"       :   this.getBaseUrl() + url,
            "method"    :   method,
            "success"   :   $.proxy(function (result) {
                this.responseCache[url] = result;
                callback(result);
            }, this),
            "complete"  :   $.proxy(this.onComplete, this),
            "error"     :   $.proxy(this.onError, this)
        });
    }
};

/**
 * abstract request success handler
 */
VDRest.Rest.Api.prototype.onSuccess = function () {};

/**
 * abstract request error handler
 */
VDRest.Rest.Api.prototype.onError = function () {};

/**
 * method to be called any time an request is complete
 */
VDRest.Rest.Api.prototype.onComplete = function () {
    VDRest.app.getModule('gui').hideThrobber();
};
