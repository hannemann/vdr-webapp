/**
 * @class
 * @constructor
 */
Gui.Window.View.Abstract = function () {};

/**
 * @type {VDRest.Lib.Cache.store.View}
 */
Gui.Window.View.Abstract.prototype = new VDRest.Abstract.View();

/**
 * initialize essentials
 */
Gui.Window.View.Abstract.prototype.init = function () {

    this.node = $('<div class="window">');

    if (this.hasCloseButton && !this.closeButton) {
        this.addCloseButton();
    }

    if (this.hasHeader) {
        this.header = $('<div class="window-header clearer">').appendTo(this.node);
        this.node.addClass('has-header');
    }

    this.body = $('<div class="window-body">').appendTo(this.node);

};

/**
 * render essentials
 */
Gui.Window.View.Abstract.prototype.render = function () {

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * add a button to close the window if configured
 */
Gui.Window.View.Abstract.prototype.addCloseButton = function () {

    this.closeButton = $('<div class="window-close">').html('&#10006;')
        .appendTo(this.node);
};

/**
 * retrieve tool button
 * @param options
 * @returns {*|jQuery|HTMLElement}
 */
Gui.Window.View.Abstract.prototype.getToolButton = function (options) {

    var dom, me=this;

    dom = $('<li>');
    if (typeof options.image != 'undefined') {

        dom.append('<img src="'+options.image.src+'">');

    } else if (typeof options.dom != 'undefined') {

        if (typeof options.dom == 'function') {

            dom.append(options.dom.apply(me));

        } else {

            dom.append(options.dom);

        }
    }

    dom.on('click', function () {

        if (typeof options.url != 'undefined') {

            if (options.target == 'new') {

                window.open(options.url);

            } else {

                location.href = options.url;
            }

        } else if (typeof options.callback == 'function') {

            options.callback.apply(me);
        }
    });

    return dom;
};

/**
 * remove window
 */
Gui.Window.View.Abstract.prototype.destruct = function () {

    $.event.trigger({
        "type" : "destruct.window-" + this.getChannel() + '/' + this.getId()
    });

    if (this.hasHeader) {
        this.header.empty();
    }
    this.body.empty();
    this.remove();
};