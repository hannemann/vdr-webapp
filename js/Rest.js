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
 */
Rest.prototype.load = function (url, method) {

    url = "undefined" !== typeof url && "undefined" !== typeof this.urls[url] ?
        this.urls[url] : this.urls.load;

    method = method || 'GET';

    this.itemList.empty();
    main.getModule('gui').showThrobber();

    if (!this.refreshCache && this.cacheResponse && "undefined" !== typeof this.responseCache[url]) {

        this.cachedResponse = true;
        this.onSuccess(this.responseCache[url]);
        this.onComplete();

    } else {

        this.cachedResponse = false;
        this.refreshCache = false;
        $.ajax({
            "url"       :   "http://"+this.host+":"+this.port+"/"+url,
            "method"    :   method,
            "success"   :   $.proxy(function (result) {
                                this.responseCache[url] = result;
                                this.onSuccess(result);
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
