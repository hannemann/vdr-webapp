VDRest.Api = function () {

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

VDRest.Api.prototype = new VDRest.Lib.Object();

/**
 * @type {String}
 */
VDRest.Api.prototype.host = config.getItem('host');

/**
 * @type {int}
 */
VDRest.Api.prototype.port = config.getItem('port');

/**
 * @type {String}
 */
VDRest.Api.prototype.protocol = config.getItem('protocol');

/**
 * @type {string}
 */
VDRest.Api.prototype.getBaseUrl = function () {

    return this.protocol + '://' + this.host + ':' + this.port + '/';
};

/**
 * fetch data from VDRest.Api api
 * @param url {string}
 * @param [method] {string}
 * @param [callback] {Function}
 */
VDRest.Api.prototype.load = function (options) {

    var url = "undefined" !== typeof options.url && "undefined" !== typeof this.urls[options.url] ?
        this.urls[options.url] : this.urls.load,

        method = options.method || 'GET',

        callback = options.callback || undefined;

    vdrest.getModule('gui').showThrobber();

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
            "url"       :   this.getBaseUrl() + "/" + url,
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
VDRest.Api.prototype.onSuccess = function () {};

/**
 * abstract request error handler
 */
VDRest.Api.prototype.onError = function () {};

/**
 * method to be called any time an request is complete
 */
VDRest.Api.prototype.onComplete = function () {
    vdrest.getModule('gui').hideThrobber();
};
