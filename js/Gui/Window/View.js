Gui.Window.View = function () {};

Gui.Window.View.prototype.wrapperClassName = 'window';

Gui.Window.View.prototype.headerClassName = 'header clearfix';

Gui.Window.View.prototype.bodyClassName = 'body';

Gui.Window.View.prototype.closeSymbol = '&#10006;';

/**
 * initialize window
 */
Gui.Window.View.prototype.init = function () {

    this.wrapper = $('<div>')
        .addClass(this.wrapperClassName);

    this.initClose()
        .initHeader()
        .initBody();
};

/**
 * @return {*}
 */
Gui.Window.View.prototype.dispatch = function () {

    this.init();

    return this.wrapper;
};

/**
 * init close button
 * @return {*}
 */
Gui.Window.View.prototype.initClose = function () {

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

    this.closeButton.on('click', $.proxy(this.closeCallback, this));
};

/**
 * method to call on close
 */
Gui.Window.View.prototype.closeCallback = function () {

    this.wrapper.remove();
    window.history.back();
};

/**
 * init header, append to wrapper
 */
Gui.Window.View.prototype.initHeader = function () {

    this.header = $('<div>')
        .addClass(this.headerClassName)
        .appendTo(this.wrapper);

    return this;
};

/**
 * init bod and appen to wrapper
 */
Gui.Window.View.prototype.initBody = function () {

    this.body = $('<div>')
        .addClass(this.bodyClassName);

    this.wrapper.append(this.body);

    return this;
};
