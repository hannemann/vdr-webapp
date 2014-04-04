VDRest.Gui.Window.View = function (window) {
    this.window = window;

    this.maxDimension = {
        "top":"20px",
        "left":"20px",
        "bottom":"20px",
        "right":"20px"
    };
};

VDRest.Gui.Window.View.prototype.windowClassName = 'window';

VDRest.Gui.Window.View.prototype.headerClassName = 'header clearfix';

VDRest.Gui.Window.View.prototype.bodyClassName = 'body';

VDRest.Gui.Window.View.prototype.closeSymbol = '&#10006;';

VDRest.Gui.Window.View.prototype.hasHeader = true;

VDRest.Gui.Window.View.prototype.hasBody = true;

VDRest.Gui.Window.View.prototype.hasCloseButton = true;

VDRest.Gui.Window.View.prototype.modal = false;

/**
 * @type {String}
 */
VDRest.Gui.Window.View.prototype.locationHash = 'default-popup';

/**
 * @type {String}
 */
VDRest.Gui.Window.View.prototype.wrapperClassName = 'default-popup';

/**
 * initialize window
 */
VDRest.Gui.Window.View.prototype.init = function () {

    this.eventPrefix = this.window.eventPrefix + '.View';

    if (this.modal) {
        vdrest.getModule('gui').addModalOverlay(this.eventPrefix + '.removed');
    }

    this.setMaxDimension();

    this.wrapper = $('<div>')
        .addClass(this.wrapperClassName+' '+this.windowClassName);

    this.initClose()
        .initHeader()
        .initBody();
};

VDRest.Gui.Window.View.prototype.removeObserver = function () {

        $(document).off(this.eventPrefix + '.removed');
        $(document).off(this.eventPrefix + '.hashChanged');
        $(document).off(this.eventPrefix + '.render.after');
};

/**
 * maximum dimension of view
 * Abstract implementation
 * @type {Object}
 */
VDRest.Gui.Window.View.prototype.setMaxDimension = function () {
    return this;
};

/**
 * @return {*}
 */
VDRest.Gui.Window.View.prototype.dispatch = function () {

    return this.wrapper;
};

/**
 * Animate Window
 */
VDRest.Gui.Window.View.prototype.triggerAnimation = function () {

    if (this.observeHash) {

        vdrest.observeHash = vdrest.getLocationHash();

    }

    this.wrapper.addClass(this.wrapperClassName)
        .css(this.getDefaultDimension())
        .appendTo('body');

    vdrest.setLocationHash(this.locationHash);

    this.wrapper.animate(this.maxDimension, 'fast', 'linear', $.proxy(function () {

        $.event.trigger({
            "type" : this.eventPrefix + ".render.after",
            "view" : this
        });

    }, this));
};

/**
 * init close button
 * @return {*}
 */
VDRest.Gui.Window.View.prototype.initClose = function () {

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
VDRest.Gui.Window.View.prototype.addCloseEvent = function () {

    this.closeButton.on('click', $.proxy(this.close, this));
};

/**
 * method to call on close
 */
VDRest.Gui.Window.View.prototype.close = function (e) {

    this.wrapper.animate(this.getDefaultDimension(), 'fast', $.proxy(function () {

        this.wrapper.remove();

        $.event.trigger({
            "type" : this.eventPrefix + '.removed',
            "view" : this
        });
        this.removeObserver();
        debugger;
        if (!e || "undefined" === typeof e.skipHistoryBack) {
            window.history.back();
        }
    }, this));
};

/**
 * retrieve dimension of window in creation state
 * @return {Object}
 */
VDRest.Gui.Window.View.prototype.getDefaultDimension = function () {

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
VDRest.Gui.Window.View.prototype.initHeader = function () {

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
VDRest.Gui.Window.View.prototype.initBody = function () {

    if (!this.hasBody) return this;

    this.body = $('<div>')
        .addClass(this.bodyClassName);

    this.wrapper.append(this.body);

    return this;
};
