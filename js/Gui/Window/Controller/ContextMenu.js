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
        config = VDRest.app.getModule('Gui.Config');

    for (i in this.data) {

        if (this.data.hasOwnProperty(i) && i !== 'isDispatched') {

            //if ('function' === typeof this.data[i].highlight) {
            //    this.data[i].highlight.call(VDRest.app.getModule(this.data[i].scope), this.data[i]);
            //}

            this.data[i].button.one(
                'mousedown', $.proxy(
                    this.handleButtonClick,
                    this,
                    this.data[i].fn,
                    VDRest.app.getModule(this.data[i].scope)
                )
            )
        }
    }

    if (VDRest.app.getCurrent() !== config.namespace + '.' + config.name) {

        this.view.node.find('.config-button')
            .one('mousedown', this.handleConfig.bind(this));
    }

    this.view.node.find('.fullscreen-button')
        .one('mousedown', this.handleFullscreen.bind(this));

    this.view.node.find('.reload-button')
        .one('mousedown', this.handleReload.bind(this));

    this.view.modalOverlay.one('click', $.proxy(function () {

        if (!this.skipBack) {
            history.back();
        }
        this.skipBack = undefined;
    }, this));
};

/**
 * call method defined as callback
 */
Gui.Window.Controller.ContextMenu.prototype.handleButtonClick = function (callback, scope) {

    this.vibrate();

    this.skipBack = true;

    history.back();

    $(document).one(this.animationEndEvents, function () {

        callback.call(scope);
    });
};

/**
 * request configuration page
 */
Gui.Window.Controller.ContextMenu.prototype.handleConfig = function () {

    this.vibrate();

    this.skipBack = true;

    history.back();

    $(document).one(this.animationEndEvents, function () {

        VDRest.app.dispatch('Gui.Config');
    });
};

/**
 * reload page
 */
Gui.Window.Controller.ContextMenu.prototype.handleReload = function () {

    this.vibrate();

    $(document).one(this.animationEndEvents, function () {

        location.reload();
    });
};

/**
 * reload page
 */
Gui.Window.Controller.ContextMenu.prototype.handleFullscreen = function () {

    this.vibrate();

    $(document).one(this.animationEndEvents, function () {

        location.reload();
    });
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
