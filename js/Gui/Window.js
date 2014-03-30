Gui.Window = function () {
    this.view = new Gui.Window.View();
};

Gui.Window.prototype = new GuiItem();

/**
 * @type {String}
 */
Gui.Window.prototype.locationHash = 'default-popup';

/**
 * @type {String}
 */
Gui.Window.prototype.wrapperClassName = 'default-popup';

/**
 * main observes current location hash if window is dispatched
 * destroys window if hash changes back to observeHash
 * @type {Boolean}
 */
Gui.Window.prototype.observeHash = false;

/**
 * maximum dimension of view
 * @type {Object}
 */
Gui.Window.prototype.maxDimension = {
    "top":"20px",
    "left":"20px",
    "bottom":"20px",
    "right":"20px"
};

/**
 * render window to body
 */
Gui.Window.prototype.dispatch = function () {

    if ("undefined" === typeof this.domElement) {
        this.domElement = this.view.dispatch();
    }

    this.dom().addClass(this.wrapperClassName)
        .css(this.view.getDefaultDimension())
        .appendTo('body');

    this.triggerAnimation();
};

/**
 * Animate Window
 */
Gui.Window.prototype.triggerAnimation = function () {

    if (this.observeHash) {

        main.observeHash = main.getLocationHash();

    }

    main.setLocationHash(this.locationHash);

    this.dom().animate(this.maxDimension, 'fast', 'linear', $.proxy(function () {

        $.event.trigger({
            "type" : "dispatched"
        });

    }, this));
};

/**
 * getter for wrapper
 * @return {*}
 */
Gui.Window.prototype.dom = function () {

    return this.domElement;
};

/**
 * getter for close button
 * @return {*}
 */
Gui.Window.prototype.getClose = function () {

    if ("undefined" != typeof this.view.closeButton) {
        return this.view.closeButton;
    }

    return false;
};

/**
 * @return {*}
 */
Gui.Window.prototype.getHeader = function () {

    if ("undefined" != typeof this.view.header) {
        return this.view.header;
    }

    return false;
};

/**
 * @return {*}
 */
Gui.Window.prototype.getBody = function () {

    if ("undefined" != typeof this.view.body) {
        return this.view.body;
    }

    return false;
};
