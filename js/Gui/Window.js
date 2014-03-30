Gui.Window = function () {
    this.view = new Gui.Window.View();
};

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
 * getter for wrapper
 * @return {*}
 */
Gui.Window.prototype.dom = function () {

    if ("undefined" === typeof this.domElement) {
        this.domElement = this.view.dispatch();
    }
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
