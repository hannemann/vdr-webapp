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

    /**
     * @type {Boolean}
     */
    this.cachedResponse = false;
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

    return this.protocol + '://' + this.host + ':' + this.port + '/';
};

/**
 * todo: split into generic, synced and async
 * fetch data from VDRest.Api.Resource api
 * @param options {object}
 */
VDRest.Api.Resource.prototype.load = function (options) {

    var url = "undefined" !== typeof options.url && "undefined" !== typeof this.urls[options.url] ?
        this.urls[options.url] : this.urls.load, me=this, data, request = {},

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

        request.url = this.getBaseUrl() + url;
        request.method = method;

        if (options.data) {
            request.data = options.data;
        }

        if (!async) {

            request.async = false;

            data = $.ajax(request);

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

        $.ajax(
            request
        ).done(function (result) {

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
VDRest.Api.Resource.prototype.onSuccess = function () {};

/**
 * abstract request error handler
 */
VDRest.Api.Resource.prototype.onError = function () {};

/**
 * method to be called any time an request is complete
 */
VDRest.Api.Resource.prototype.onComplete = function () {

    VDRest.app.getModule('Gui.Menubar').getController('Default').hideThrobber();
};
