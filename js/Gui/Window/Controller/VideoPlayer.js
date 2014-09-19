/**
 * @class
 * @constructor
 */
Gui.Window.Controller.VideoPlayer = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.Controller.VideoPlayer.prototype = new Gui.Window.Controller.Abstract();

/**
 * @type {string}
 */
Gui.Window.Controller.VideoPlayer.prototype.cacheKey = 'url';

/**
 * initialize view
 */
Gui.Window.Controller.VideoPlayer.prototype.init = function () {

    this.eventPrefix = 'window.videoplayer';
    this.data.isTv = false;
    this.data.isVideo = false;

    if ("undefined" !== typeof this.data.channel) {

        this.data.isTv = true;
    } else {
        this.data.isVideo = true;
    }

    this.view = this.module.getView('VideoPlayer', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);

    this.view.setParentView({
        "node" : $('body')
    });
};

Gui.Window.Controller.VideoPlayer.prototype.dispatchView = function () {

    this.addObserver();

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);
};

/**
 * add event listeners
 */
Gui.Window.Controller.VideoPlayer.prototype.addObserver = function () {

    $(window).on('orientationchange.'+this.keyInCache, $.proxy(this.view.setPosition, this.view));
    this.view.controls.on('click.'+this.keyInCache, $.proxy(this.view.toggleControls, this.view));
    this.view.ctrlStop.on('click.'+this.keyInCache, $.proxy(this.stopPlayback, this));
    this.view.ctrlPlay.on('click.'+this.keyInCache, $.proxy(this.startPlayback, this));
    this.view.ctrlFullScreen.on('click.'+this.keyInCache, $.proxy(this.toggleFullScreen, this));
};

/**
 * start playback
 */
Gui.Window.Controller.VideoPlayer.prototype.startPlayback = function () {

    var d = new Date(), src = this.data.url;

    if (this.view.controls.hasClass('hide')) {
        return;
    }
    src += (src.indexOf('?') > -1 ? '&' : '?') + 'd=' + d.getTime() + d.getMilliseconds();
    this.getVideo().src = src;
    this.getVideo().play();
};

/**
 * stop playback
 */
Gui.Window.Controller.VideoPlayer.prototype.stopPlayback = function () {

    if (this.view.controls.hasClass('hide')) {
        return;
    }
    history.back();
};

/**
 * toggle fullscreen
 * @param {jQuery.Event} [e]
 */
Gui.Window.Controller.VideoPlayer.prototype.toggleFullScreen = function (e) {

    var isFullscreen = false;

    e && e.stopPropagation();

    if ("undefined" != typeof document.fullScreen) {
        isFullscreen = document.fullScreen;
    }

    if ("undefined" != typeof document.mozFullscreen) {
        isFullscreen = document.mozFullscreen;
    }

    if ("undefined" != typeof document.webkitIsFullScreen) {
        isFullscreen = document.webkitIsFullScreen;
    }

    this[isFullscreen ? 'cancelFullscreen' : 'requestFullscreen']();
};

/**
 * hides status bar and dims buttons
 * use video tag if one day all the bugs are fixed
 * (no custom controls possible, garbled playback for some time after change)
 */
Gui.Window.Controller.VideoPlayer.prototype.requestFullscreen = function () {

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
};

/**
 * leave fullscreen
 */
Gui.Window.Controller.VideoPlayer.prototype.cancelFullscreen = function () {

    if (document.cancelFullScreen) {
        document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
};

/**
 * retrieve video tag
 */
Gui.Window.Controller.VideoPlayer.prototype.getPlayer = function () {

    return this.view.node;
};

/**
 * retrieve video tag
 */
Gui.Window.Controller.VideoPlayer.prototype.getVideo = function () {

    return this.view.player.get(0);
};

/**
 * add event listeners
 */
Gui.Window.Controller.VideoPlayer.prototype.removeObserver = function () {

    $(window).off('orientationchange.'+this.keyInCache);
    $(this.view.controls).off('click.'+this.keyInCache);
    $(this.view.stop).off('click.'+this.keyInCache);
};

/**
 * destroy
 */
Gui.Window.Controller.VideoPlayer.prototype.destructView = function () {

    Gui.Window.Controller.Abstract.prototype.destructView.call(this);
    this.module.cache.invalidateAllTypes(this);
};