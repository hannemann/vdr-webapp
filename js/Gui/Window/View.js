Gui.Window.View = function () {};

Gui.Window.View.prototype.wrapperClassName = 'window';

Gui.Window.View.prototype.headerClassName = 'header clearfix';

Gui.Window.View.prototype.bodyClassName = 'body';

Gui.Window.View.prototype.closeSymbol = '&#10006;';

Gui.Window.View.prototype.hasHeader = true;

Gui.Window.View.prototype.hasBody = true;

Gui.Window.View.prototype.hasCloseButton = true;

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

    $(document).one('dispatched', $.proxy(function () {

        main.destroy = $.proxy(this.historyCallback, this);
    }, this));

    return this.wrapper;
};

/**
 * init close button
 * @return {*}
 */
Gui.Window.View.prototype.initClose = function () {

    if (!this.hasCloseButton) return;

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

    var me = this;
    this.wrapper.animate(this.getDefaultDimension(), 'fast', function () {

        me.wrapper.remove();
        window.history.back();
    });
};

/**
 * method to call on close
 */
Gui.Window.View.prototype.historyCallback = function () {

    var me = this;
    this.wrapper.animate(this.getDefaultDimension(), 'fast', function () {

        me.wrapper.remove();
    });
};

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

    if (!this.hasHeader) return;

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

    if (!this.hasBody) return;

    this.body = $('<div>')
        .addClass(this.bodyClassName);

    this.wrapper.append(this.body);

    return this;
};
