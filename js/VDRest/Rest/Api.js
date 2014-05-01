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
 * @param options {object}
 */
VDRest.Rest.Api.prototype.load = function (options) {

    var url = "undefined" !== typeof options.url && "undefined" !== typeof this.urls[options.url] ?
        this.urls[options.url] : this.urls.load, me=this, data,

        method = options.method || 'GET',

        callback = options.callback || undefined,

        async = options.async !== false;

    VDRest.app.getModule('Gui.Menubar').getController('Default').showThrobber();

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

        if (!async) {

            data = $.ajax({
                "url": this.getBaseUrl() + url,
                "method": method,
                "async" : false
            });

            this.onComplete(data);

            if (data.readyState === 4 && data.status === 200) {

                me.responseCache[url] = data;
                "function" === typeof callback && callback(data);

                return data;

            } else {

                this.onError(data);

                return false;
            }
        }

        $.ajax({

            "url": this.getBaseUrl() + url,
            "method": method

        }).done(function (result) {

            me.responseCache[url] = result;
            callback(result);

        }).fail(function () {

            me.onError.apply(me, arguments)

        }).always(function () {

            me.onComplete.apply(me, arguments)
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

    VDRest.app.getModule('Gui.Menubar').getController('Default').hideThrobber();
};
