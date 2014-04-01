Gui.Window = function () {};

Gui.Window.prototype = new Gui.Item();

Gui.Window.prototype.windowWrapper = 'Gui';

Gui.Window.prototype.viewWrapper = 'Window';

Gui.Window.prototype.viewClassName = 'View';

/**
 * main observes current location hash if window is dispatched
 * destroys window if hash changes back to observeHash
 * @type {Boolean}
 */
Gui.Window.prototype.observeHash = false;

/**
 * render window to body
 */
Gui.Window.prototype.dispatch = function () {

    Gui.Item.apply(this, arguments);
    this.setEventPrefix();

    $.event.trigger({
        "type"      :   this.eventPrefix + ".dispatch.before",
        "window"    :   this,
        "arguments" :   arguments
    });
debugger;
    this.init();
    $(document).one(this.eventPrefix + '.close', $.proxy(this.close, this));

    $(document).one(this.eventPrefix + '.View.render.after', $.proxy(function () {

        main.addDestroyer(this.eventPrefix + '.hashChanged', $.proxy(this.close, this));
    }, this));

    this.view.triggerAnimation();

    $.event.trigger({
        "type"      :   this.eventPrefix + ".dispatch.after",
        "window"    :   this,
        "arguments" :   arguments
    });
};

Gui.Window.prototype.close = function () {

    $(document).off(this.eventPrefix + '.dispatch.before');
    $(document).off(this.eventPrefix + '.dispatch.after');
    this.view.close();
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
