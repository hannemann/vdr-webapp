Gui.Window = function () {};

Gui.Window.prototype = new Gui.Item();

Gui.Window.prototype.windowWrapper = 'Gui';

Gui.Window.prototype.viewWrapper = 'Window';

Gui.Window.prototype.viewClassName = 'View';

/**
 * render window to body
 */
Gui.Window.prototype.dispatch = function () {

    Gui.Item.apply(this, arguments);
    this.setEventPrefix();

    $.event.trigger({
        "type"      :   this.eventPrefix + ".before",
        "window"    :   this,
        "arguments" :   arguments
    });

    this.init();
    $(document).one(this.eventPrefix + '.close', $.proxy(this.view.close, this.view));
    this.view.triggerAnimation();

    $.event.trigger({
        "type"      :   this.eventPrefix + ".after",
        "window"    :   this,
        "arguments" :   arguments
    });
};

Gui.Window.prototype.setEventPrefix = function () {

    this.eventPrefix = this.windowWrapper+'.'+this.viewWrapper;
    return this;
};

Gui.Window.prototype.init = function () {

    this.view = new window[this.windowWrapper][this.viewWrapper][this.viewClassName](this);
    this.view.init();
    this.appendChildren();
};

Gui.Window.prototype.appendChildren = function () {};

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
