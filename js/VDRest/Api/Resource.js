VDRest.Api.Resource = function () {

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

    $.xhrPool = [];
    $.xhrPool.abortAll = function () {
        $(this).each(function (i, jqXHR) {   //  cycle through list of recorded connection
            jqXHR.abort();  //  aborts connection
            $.xhrPool.splice(i, 1); //  removes from list by index
        });
    };
    $.ajaxSetup({
        beforeSend: function (jqXHR) {
            $.xhrPool.push(jqXHR);
        }, //  annd connection to list
        complete: function (jqXHR) {
            var i = $.xhrPool.indexOf(jqXHR);   //  get index for current connection completed
            if (i > -1) $.xhrPool.splice(i, 1); //  removes from list by index
        }
    });
};

VDRest.Api.Resource.prototype = new VDRest.Lib.Object();

/**
 * @type {String}
 */
VDRest.Api.Resource.prototype.host = VDRest.config.getItem('host');

/**
 * @type {int}
 */
VDRest.Api.Resource.prototype.port = VDRest.config.getItem('port');

/**
 * @type {String}
 */
VDRest.Api.Resource.prototype.protocol = VDRest.config.getItem('protocol');

/**
 * @type {string}
 */
VDRest.Api.Resource.prototype.getBaseUrl = function () {

    var url = this.protocol + '://' + this.host;

    if (80 !== parseInt(this.port) && 443 !== parseInt(this.port)) {

        url += ':' + this.port;
    }
    return  url + '/';
};

/**
 * fetch data from VDR
 * @param options {object}
 */
VDRest.Api.Resource.prototype.load = function (options) {

    var url = "undefined" !== typeof options.url && "undefined" !== typeof this.urls[options.url] ?
        this.urls[options.url] : this.urls.load, request = {},

        method = options.method || 'GET',

        callback = options.callback || undefined,

        async = options.async !== false;

    if (this.locationIsSecure() && !this.requestIsSecure()) {

        $.event.trigger({
            "type": "window.request",
            "payload": {
                "type": "Alert",
                "data": {
                    "message": "Blocked Content",
                    "info": "Location is secured via SSL but requested data from an insecure resource.",
                    "settings": true
                }
            }
        });
        return false;
    }

    if ("function" !== typeof callback) {

        callback = this.onSuccess;
    }

    if (!this.refreshCache && this.cacheResponse && "undefined" !== typeof this.responseCache[url]) {

        callback(this.responseCache[url]);
        this.onComplete();

    } else {

        this.refreshCache = false;

        request.url = this.getBaseUrl() + url;
        request.method = method;

        if (options.data) {
            request.data = options.data;
        }

        if (!async) {

            return this.fetchSync(request, callback);
        }

        if (VDRest.config.getItem('useSlowServerStrategy')) {

            request.async = false;
        }

        this.fetchAsync(request, callback);
    }
};

/**
 * fetch data asynchronous, fire callback on success
 * @param {{}} request
 * @param {Function} callback
 */
VDRest.Api.Resource.prototype.fetchAsync = function (request, callback) {

    var me = this;

    if (!this.noThrobber) {

        $.event.trigger({
            "type": "showThrobber"
        });
    }

    $.ajax(
        request
    )
        .done(function (result) {

            me.responseCache[request.url] = result;
            callback(result);

        }).fail(function () {

            me.onError.apply(me, arguments)

        }).always(function () {

            me.onComplete.apply(me, arguments)
        });
};

/**
 * fetch data synchronous, return data and fire callback if requested
 * @returns {{}|boolean}
 */
VDRest.Api.Resource.prototype.fetchSync = function (request, callback) {

    var data;

    if (!this.noThrobber) {

        $.event.trigger({
            "type": "showThrobber"
        });
    }

    request.async = false;

    data = $.ajax(request);

    this.onComplete(data);

    if (data.readyState === 4 && data.status === 200) {

        this.responseCache[request.url] = data;
        "function" === typeof callback && callback(data);

        return data;

    } else {

        this.onError(data);

        return false;
    }
};

/**
 * abstract request success handler
 */
VDRest.Api.Resource.prototype.onSuccess = function () {};

/**
 * abstract request error handler
 */
VDRest.Api.Resource.prototype.onError = function (e) {

    VDRest.helper.log(e);

    if (0 === e.readyState && 0 === e.status && e.statusText !== 'abort') {

        $.event.trigger({
            "type": "window.request",
            "payload": {
                "type": "Alert",
                "data": {
                    "message": "Error loading resource",
                    "info": "Please make sure that your device is connected to the Network and that host and port settings are set properly",
                    "settings": true
                }
            }
        });
    }

    if (4 === e.readyState && ( 502 === e.status || 403 === e.status )) {

        $.event.trigger({
            "type": "window.request",
            "payload": {
                "type": "Alert",
                "data": {
                    "message": e.statusText
                }
            }
        });
    }
};

/**
 * method to be called any time an request is complete
 */
VDRest.Api.Resource.prototype.onComplete = function () {

    if (!this.noThrobber) {

        $.event.trigger({
            "type": "hideThrobber"
        });
    }
};

/**
 * Determine if app has been loaded via SSL
 * @returns {boolean}
 */
VDRest.Api.Resource.prototype.locationIsSecure = function () {
    return location.protocol.indexOf('s') > -1;
};

/**
 * Determine if request will be done via SSL
 * @returns {boolean}
 */
VDRest.Api.Resource.prototype.requestIsSecure = function () {
    return VDRest.config.getItem('protocol').indexOf('s') > -1;
};
