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
 * @type {string}
 */
Rest.prototype.host = config.getItem('host');

/**
 * @type {int}
 */
Rest.prototype.port = config.getItem('port');

/**
 * fetch data from rest api
 * @param url {string}
 */
Rest.prototype.load = function (url) {

    url = "undefined" !== typeof url && "undefined" !== typeof this.urls[url] ?
        this.urls[url] : this.urls.load;

    this.itemList.empty();
    main.getModule('gui').showThrobber();

    if (!this.refreshCache && this.cacheResponse && "undefined" !== typeof this.responseCache[url]) {

        this.cachedResponse = true;
        this.onSuccess(this.responseCache[url]);
        this.onComplete();

    } else {

        this.cachedResponse = false;
        $.ajax({
            "url"       :   "http://"+this.host+":"+this.port+"/"+url,
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
 * @param result
 */
Rest.prototype.onSuccess = function (result) {};

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
