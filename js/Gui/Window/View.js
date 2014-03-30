Gui.Window.View = function () {};

Gui.Window.View.prototype.wrapperClassName = 'window';

Gui.Window.View.prototype.headerClassName = 'header clearfix';

Gui.Window.View.prototype.bodyClassName = 'body';

Gui.Window.View.prototype.closeSymbol = '&#10006;';

Gui.Window.View.prototype.hasHeader = true;

Gui.Window.View.prototype.hasBody = true;

Gui.Window.View.prototype.hasCloseButton = true;

Gui.Window.View.prototype.modal = false;

/**
 * initialize window
 */
Gui.Window.View.prototype.init = function () {

    if (this.modal) {

        this.modalOverlay = $('<div>').css({
            "top":0,
            "right":0,
            "bottom":0,
            "left":0,
            "opacity":"0.5",
            "background-color":"#000000",
            "position":"fixed"
        }).appendTo($('body'));
    }

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

        main.addDestroyer($.proxy(this.historyCallback, this));
    }, this));

    return this.wrapper;
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

    this.closeButton.on('click', $.proxy(this.closeCallback, this));
};

/**
 * method to call on close
 */
Gui.Window.View.prototype.closeCallback = function () {

    this.wrapper.animate(this.getDefaultDimension(), 'fast', $.proxy(function () {

        if (this.modal) {
            this.modalOverlay.remove();
        }
        this.wrapper.remove();
        window.history.back();
    }, this));
};

/**
 * method to call on close
 */
Gui.Window.View.prototype.historyCallback = function () {

    this.wrapper.animate(this.getDefaultDimension(), 'fast', $.proxy(function () {

        this.wrapper.remove();

        if (this.modal) {

            this.modalOverlay.remove();
        }

    }, this));
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
