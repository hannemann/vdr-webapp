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
 * retrieve default node
 * @returns {*|jQuery|HTMLElement}
 */
Gui.Window.View.Abstract.prototype.getNode = function () {

    return $('<div class="window">');
};

/**
 * initialize essentials
 */
Gui.Window.View.Abstract.prototype.init = function () {

    this.node = this.getNode();

    if (this.hasDesktopCloseButton && "undefined" !== typeof navigator.maxTouchPoints && navigator.maxTouchPoints == 0) {
        this.hasCloseButton = true;
    }

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

    if (this.isModal) {

        this.addModalOverlay(this.parentView);
    }

    if (this.isModalViewport) {

        this.addModalOverlay(VDRest.app.getModule('Gui.Viewport').getView('Default'));
    }

    if (this.modalExtraClasses) {

        this.modalOverlay.addClass(this.modalExtraClasses);
    }

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * add modal overlay, set as parentView
 * @param parentView
 */
Gui.Window.View.Abstract.prototype.addModalOverlay = function (parentView) {

    this.modalClassNameShow = 'show-modal';
    this.modalClassNameHide = 'hide-modal';

    if (this.isModalOpaque) {
        this.modalClassNameShow += '-opaque';
        this.modalClassNameHide += '-opaque';
    }
    /**
     * @type {VDRest.Abstract.view|object}
     * @property {jQuery.fn.init} node
     */
    parentView = parentView || $('body');

    this.modalOverlay = $('<div class="modal-overlay dark">').appendTo(parentView.node);

    if (this.isModalTransparent) {
        this.modalOverlay.toggleClass('dark transparent');
    } else {

        $('body').addClass(this.modalClassNameShow);
    }

    this.parentView = {
        "node" : this.modalOverlay
    };
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

        VDRest.Abstract.Controller.prototype.vibrate();

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

Gui.Window.View.Abstract.prototype.removeModal = function (e) {

    if (e.currentTarget === this.modalOverlay[0]) {

        this.modalOverlay[0].removeEventListener(
            VDRest.Abstract.Controller.prototype.animationEndEvents,
            this.removeModalHandler
        );
        delete this.removeModalHandler;
        this.modalOverlay.remove();
        delete this.modalOverlay;

        document.body.classList.remove(this.modalClassNameHide);
        document.body.classList.remove(this.modalClassNameShow);
    }
};

/**
 * remove window
 */
Gui.Window.View.Abstract.prototype.destruct = function () {

    if (this.hasHeader) {
        this.header.empty();
        delete this.header;
    }
    if (this.hasOwnProperty('body')) {
        this.body.empty();
        delete this.body;
    }
    this.remove();
    delete this.node;

    if (this.isModal || this.isModalViewport) {

        if (!this.isModalTransparent) {

            this.removeModalHandler = this.removeModal.bind(this);

            this.modalOverlay[0].addEventListener(
                VDRest.Abstract.Controller.prototype.animationEndEvents,
                this.removeModalHandler
            );
            document.body.classList.add(this.modalClassNameHide);
            document.body.classList.add(this.modalClassNameShow);

        } else {

            this.modalOverlay.remove();
            delete this.modalOverlay;
        }
    }
};