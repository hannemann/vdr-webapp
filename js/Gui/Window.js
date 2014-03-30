Gui.Window = function () {
    this.view = new Gui.Window.View();
};

Gui.Window.prototype = new GuiItem();

Gui.Window.prototype.locationHash = 'default-popup';

Gui.Window.prototype.wrapperClassName = 'default-popup';

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

Gui.Window.prototype.triggerAnimation = function () {

    this.dom().animate(this.maxDimension, 'fast', 'linear', $.proxy(function () {

        $.event.trigger({
            "type" : "dispatched"
        });
        window.location.hash = '#' + this.locationHash;
    }, this));
};

/**
 * getter for wrapper
 * @return {*}
 */
Gui.Window.prototype.dom = function () {

//    if ("undefined" === typeof this.domElement) {
//        this.domElement = this.view.dispatch();
//    }
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
