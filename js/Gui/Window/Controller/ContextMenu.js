/**
 * @class
 * @constructor
 * @var {object} data
 */
Gui.Window.Controller.ContextMenu = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.Controller.ContextMenu.prototype = new Gui.Window.Controller.Abstract();

/**
 * initialize view
 */
Gui.Window.Controller.ContextMenu.prototype.init = function () {

    this.eventPrefix = 'window.contextmenu';

    this.view = this.module.getView('ContextMenu', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * dispatch
 */
Gui.Window.Controller.ContextMenu.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * add event listeners
 */
Gui.Window.Controller.ContextMenu.prototype.addObserver = function () {

    var i,
        configButton = this.view.node.find('.config-button'),
        reloadButton = this.view.node.find('.reload-button'),
        resizeButton = this.view.node.find('.resize-button'),
        upEvent = 'touchend', downEvent = 'touchstart';

    if (!VDRest.helper.isTouchDevice) {
        upEvent = 'mouseup';
        downEvent = 'mousedown';
    } else {
        this.preventReloadHandler = this.preventScrollReload.bind(this, this.view.body);
        this.view.node.on('touchmove', this.preventReloadHandler);
    }

    for (i in this.data) {

        if (this.data.hasOwnProperty(i) && i !== 'isDispatched') {

            //if ('function' === typeof this.data[i].highlight) {
            //    this.data[i].highlight.call(VDRest.app.getModule(this.data[i].scope), this.data[i]);
            //}

            this.data[i].button
                .on(upEvent, this.handleUp.bind(this, this.data[i].fn, VDRest.app.getModule(this.data[i].scope)))
                .on(downEvent, this.handleDown.bind(this, this.data[i].button[0]))
            ;
        }
    }

    if (VDRest.app.startModule === VDRest.app.getCurrent()) {

        configButton
            .on(upEvent, this.handleUp.bind(this, this.configAction, this))
            .on(downEvent, this.handleDown.bind(this, configButton[0]))
        ;
    }

    reloadButton
        .on(upEvent, this.handleUp.bind(this, this.reloadAction, this))
        .on(downEvent, this.handleDown.bind(this, reloadButton[0]));
    resizeButton
        .on(upEvent, this.handleUp.bind(this, this.resizeAction, this))
        .on(downEvent, this.handleDown.bind(this, resizeButton[0]));

    //this.view.node.find('.fullscreen-button')
    //    .one('mousedown', this.handleFullscreen.bind(this));

    this.view.modalOverlay.one('click', function () {

        if (!this.skipBack) {
            history.back();
        }
        this.skipBack = undefined;
    }.bind(this));
};

/**
 * remove event listeners
 */
Gui.Window.Controller.ContextMenu.prototype.removeObserver = function () {

    var i,
        config = VDRest.app.getModule('Gui.Config');

    if (VDRest.helper.isTouchDevice) {
        this.view.node.off('touchmove', this.preventReloadHandler);
    }

    for (i in this.data) {

        if (this.data.hasOwnProperty(i) && i !== 'isDispatched') {

            this.data[i].button.off('mousedown mouseup touchstart touchend')
        }
    }

    if (VDRest.app.getCurrent() !== config.namespace + '.' + config.name) {

        this.view.node.find('.config-button').off('mousedown mouseup touchstart touchend');
    }

    //this.view.node.find('.fullscreen-button').off('mousedown');

    this.view.node.find('.reload-button').off('mousedown mouseup touchstart touchend');

    this.view.node.find('.resize-button').off('mousedown mouseup touchstart touchend');

    this.view.modalOverlay.off('click');
};

/**
 * call method defined as callback
 */
Gui.Window.Controller.ContextMenu.prototype.handleUp = function (callback, scope) {

    if (VDRest.helper.canCancelEvent) {
        return;
    }

    this.vibrate();

    this.skipBack = true;

    history.back();

    $document.one(this.animationEndEvents, function () {

        callback.call(scope);
    });
};

/**
 * handle mousedown
 */
Gui.Window.Controller.ContextMenu.prototype.handleDown = function (node, e) {

    activeAnimate.applyAnimation(e, node);
};

/**
 * request configuration page
 */
Gui.Window.Controller.ContextMenu.prototype.configAction = function () {

    VDRest.app.dispatch('Gui.Config');
};

/**
 * reload page
 */
Gui.Window.Controller.ContextMenu.prototype.reloadAction = function () {

    location.reload();
};

Gui.Window.Controller.ContextMenu.prototype.resizeAction = function () {

    var height = (window.innerWidth - VDRest.helper.scrollbarWidth) / 16 * 9;
    window.resizeTo(window.innerWidth, height);
};

Gui.Window.Controller.ContextMenu.prototype.handleFullscreen = function () {

    this[VDRest.helper.getIsFullscreen() ? 'cancelFullscreen' : 'requestFullscreen']();
};

/**
 * hides status bar and dims buttons
 * use video tag if one day all the bugs are fixed
 * (no custom controls possible, garbled playback for some time after change)
 */
Gui.Window.Controller.ContextMenu.prototype.requestFullscreen = function () {

    if ((document.fullScreenElement && document.fullScreenElement !== null) ||
        (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {
            document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    }

    this.view.node.find('.fullscreen-button').html(VDRest.app.translate('Exit fullscreen'));
};

/**
 * leave fullscreen
 */
Gui.Window.Controller.ContextMenu.prototype.cancelFullscreen = function () {

    if (document.cancelFullScreen) {
        document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }

    this.view.node.find('.fullscreen-button').html(VDRest.app.translate('Go fullscreen'));
};
