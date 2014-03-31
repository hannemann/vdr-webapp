Gui.Window.View = function (window) {
    this.window = window;

    this.maxDimension = {
        "top":"20px",
        "left":"20px",
        "bottom":"20px",
        "right":"20px"
    };
};

Gui.Window.View.prototype.windowClassName = 'window';

Gui.Window.View.prototype.headerClassName = 'header clearfix';

Gui.Window.View.prototype.bodyClassName = 'body';

Gui.Window.View.prototype.closeSymbol = '&#10006;';

Gui.Window.View.prototype.hasHeader = true;

Gui.Window.View.prototype.hasBody = true;

Gui.Window.View.prototype.hasCloseButton = true;

Gui.Window.View.prototype.modal = false;

/**
 * @type {String}
 */
Gui.Window.View.prototype.locationHash = 'default-popup';

/**
 * @type {String}
 */
Gui.Window.View.prototype.wrapperClassName = 'default-popup';

/**
 * main observes current location hash if window is dispatched
 * destroys window if hash changes back to observeHash
 * @type {Boolean}
 */
Gui.Window.View.prototype.observeHash = false;

/**
 * initialize window
 */
Gui.Window.View.prototype.init = function () {

    this.eventPrefix = this.window.eventPrefix + '.View';

    if (this.modal) {
        main.getModule('gui').addModalOverlay(this.eventPrefix + '.removed');
    }

    this.setMaxDimension();
    this.setObserver();

    this.wrapper = $('<div>')
        .addClass(this.wrapperClassName+' '+this.windowClassName);

    this.initClose()
        .initHeader()
        .initBody();
};

Gui.Window.View.prototype.setObserver = function () {

    $(document).one(this.eventPrefix + '.dispatched', $.proxy(function () {

        main.addDestroyer(this.eventPrefix + '.hashChanged', $.proxy(this.close, this));
    }, this));
};

/**
 * maximum dimension of view
 * Abstract implementation
 * @type {Object}
 */
Gui.Window.View.prototype.setMaxDimension = function () {
    return this;
};

/**
 * @return {*}
 */
Gui.Window.View.prototype.dispatch = function () {

    return this.wrapper;
};

/**
 * Animate Window
 */
Gui.Window.View.prototype.triggerAnimation = function () {

    if (this.observeHash) {

        main.observeHash = main.getLocationHash();

    }

    this.wrapper.addClass(this.wrapperClassName)
        .css(this.getDefaultDimension())
        .appendTo('body');

    main.setLocationHash(this.locationHash);

    this.wrapper.animate(this.maxDimension, 'fast', 'linear', $.proxy(function () {

        $.event.trigger({
            "type" : this.eventPrefix + ".dispatched",
            "view" : this
        });

    }, this));
};

/**
 * init close button
 * @return {*}
 */
Gui.Window.View.prototype.initClose = function () {

    if (!this.hasCloseButton) return this;

    this.closeButton = button = $('<div>')
        .addClass('close')
        .html(this.closeSymbol);

    this.addCloseEvent();

    this.closeButton.prependTo(this.wrapper);

    return this;
};

/**
 * add click event to close button
 */
Gui.Window.View.prototype.addCloseEvent = function () {

    this.closeButton.on('click', $.proxy(this.close, this));
};

/**
 * method to call on close
 */
Gui.Window.View.prototype.close = function (e) {

    this.wrapper.animate(this.getDefaultDimension(), 'fast', $.proxy(function () {

        this.wrapper.remove();

        $.event.trigger({
            "type" : this.eventPrefix + '.removed',
            "view" : this
        });

        if (e && "undefined" === typeof e.skipHistoryBack) {
            window.history.back();
        }
    }, this));
};

/**
 * retrieve dimension of window in creation state
 * @return {Object}
 */
Gui.Window.View.prototype.getDefaultDimension = function () {

    var window = $(top),
        width = parseInt(window.width()/2),
        height = parseInt(window.height()/2);

    return {
        "top"   :   height + "px",
        "left"  :   width + "px",
        "bottom":   height + "px",
        "right" :   width + "px"
    };
};

/**
 * init header, append to wrapper
 */
Gui.Window.View.prototype.initHeader = function () {

    if (!this.hasHeader) return this;

    this.header = $('<div>')
        .addClass(this.headerClassName)
        .appendTo(this.wrapper);

    this.wrapper.addClass('has-header');

    return this;
};

/**
 * init bod and appen to wrapper
 */
Gui.Window.View.prototype.initBody = function () {

    if (!this.hasBody) return this;

    this.body = $('<div>')
        .addClass(this.bodyClassName);

    this.wrapper.append(this.body);

    return this;
};
