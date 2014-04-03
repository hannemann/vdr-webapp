Rest = function () {

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

Rest.prototype = new Lib.Object();

/**
 * @type {String}
 */
Rest.prototype.host = config.getItem('host');

/**
 * @type {int}
 */
Rest.prototype.port = config.getItem('port');

/**
 * @type {String}
 */
Rest.prototype.protocol = config.getItem('protocol');

/**
 * @type {string}
 */
Rest.prototype.getBaseUrl = function () {

    return this.protocol + '://' + this.host + ':' + this.port + '/';
};

/**
 * fetch data from rest api
 * @param url {string}
 * @param [method] {string}
 * @param [callback] {Function}
 */
Rest.prototype.load = function (options) {

    var url = "undefined" !== typeof options.url && "undefined" !== typeof this.urls[options.url] ?
        this.urls[options.url] : this.urls.load,

        method = options.method || 'GET',

        callback = options.callback || undefined;

    main.getModule('gui').showThrobber();

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
Rest.prototype.onSuccess = function () {};

/**
 * abstract request error handler
 */
Rest.prototype.onError = function () {};

/**
 * method to be called any time an request is complete
 */
Rest.prototype.onComplete = function () {
    main.getModule('gui').hideThrobber();
};
