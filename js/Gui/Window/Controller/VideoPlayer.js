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

    this.module.setVideoPlayer(this);
    this.eventPrefix = 'window.videoplayer';
    this.data.isTv = false;
    this.data.isVideo = false;
    this.data.isMinimized = false;

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

/**
 * dispatch view
 */
Gui.Window.Controller.VideoPlayer.prototype.dispatchView = function () {

    this.addObserver();

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);
};

/**
 * add event listeners
 */
Gui.Window.Controller.VideoPlayer.prototype.addObserver = function () {

    var me = this;

    $(window).on('orientationchange.'+this.keyInCache, $.proxy(this.view.setPosition, this.view));

    this.view.node.swipe({
        "swipeStatus" : function (event, phase, direction, distance, duration, fingers) {
            if ("up" === direction) {
                me.setVolume('increase');
            }
            if ("down" === direction) {
                me.setVolume('decrease');
            }
        }
    });

    this.view.controls.on('click.'+this.keyInCache, $.proxy(this.view.toggleControls, this.view));
    this.view.ctrlStop.on('click.'+this.keyInCache, $.proxy(this.stopPlayback, this));
    this.view.ctrlPlay.on('click.'+this.keyInCache, $.proxy(this.togglePlayback, this));
    this.view.ctrlFullScreen.on('click.'+this.keyInCache, $.proxy(this.toggleFullScreen, this));
    this.view.ctrlMinimize.on('click.'+this.keyInCache, $.proxy(this.toggleMinimize, this));
    if (this.data.isTv) {
        this.view.ctrlChannelUp.on('click.'+this.keyInCache, $.proxy(this.changeSrc, this));
        this.view.ctrlChannelDown.on('click.'+this.keyInCache, $.proxy(this.changeSrc, this));
    }
};

/**
 * add event listeners
 */
Gui.Window.Controller.VideoPlayer.prototype.removeObserver = function () {

    $(window).off('orientationchange.'+this.keyInCache);
    this.view.node.swipe('destroy');
    $(this.view.controls).off('click');
    $(this.view.stop).off('click');
    this.view.ctrlPlay.on('click');
    this.view.ctrlFullScreen.on('click');
    this.view.ctrlMinimize.on('click');
    if (this.data.isTv) {
        this.view.ctrlChannelUp.off('click');
        this.view.ctrlChannelDown.off('click');
    }
};

Gui.Window.Controller.VideoPlayer.prototype.setVolume = function (action) {

    var video = this.getVideo(), vol = video.volume, value = 0.02;

    if ('increase' == action) {

        video.volume = vol + value > 1 ? 1 : vol + value;
    } else {

        video.volume = vol - value < 0 ? 0 : vol - value;
    }
    this.view.setVolumeSliderHeight();
};

/**
 * toggle playback
 */
Gui.Window.Controller.VideoPlayer.prototype.togglePlayback = function () {

    this[this.isPlaying ? 'pausePlayback' : 'startPlayback']();
};

/**
 * toggle playback
 */
Gui.Window.Controller.VideoPlayer.prototype.toggleMinimize = function () {

    var me = this;

    if (!this.data.isMinimized) {
        this.cancelFullscreen();
        this.destroyer = VDRest.app.destroyer.pop();
        this.observeHash = VDRest.app.getLocationHash();
        VDRest.app.observeHash.pop();
        history.back();
    } else {
        VDRest.app.observe();
        VDRest.app.setLocationHash(this.observeHash);
        VDRest.app.destroyer.push(this.destroyer);
        $(this.view.controls).trigger('click');
    }
    this.view.toggleMinimize();
    this.data.isMinimized = !this.data.isMinimized;

    if (this.data.isMinimized) {
        setTimeout(function () {
            me.view.node.one('click', function () {
                me.toggleMinimize();
            });
        }, 2000);
    }
};

/**
 * start playback
 */
Gui.Window.Controller.VideoPlayer.prototype.startPlayback = function (force) {

    var d = new Date(), src;

    if (this.data.channel) {
        src = this.data.channel.dataModel.getStreamUrl();
    } else if (this.data.recording) {
        src = this.data.url;
    }

    if (!force && this.view.controls.hasClass('hide')) {
        return;
    }

    this.isPlaying = true;

    this.view.toggleThrobber();

    src += (src.indexOf('?') > -1 ? '&' : '?') + 'd=' + d.getTime() + d.getMilliseconds();
    this.getVideo().src = src;
    this.getVideo().play();

    $(this.getVideo()).one('playing', $.proxy(function () {
        this.view.toggleThrobber();
        this.view.ctrlPlay.html(this.view.symbolPause).addClass('pause');
    }, this));
};

/**
 * pause playback
 */
Gui.Window.Controller.VideoPlayer.prototype.pausePlayback = function () {

    this.isPlaying = false;

    this.getVideo().pause();
    this.getVideo().src = false;
    this.view.ctrlPlay.html(this.view.symbolPlay).removeClass('pause');
};

/**
 * stop playback
 */
Gui.Window.Controller.VideoPlayer.prototype.stopPlayback = function (force) {

    if (!force && this.view.controls.hasClass('hide')) {
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
 * load channel model and switch to channel
 * @param e
 */
Gui.Window.Controller.VideoPlayer.prototype.changeSrc = function (e) {

    var channels, getter, me = this;

    if (e instanceof VDRest.Epg.Model.Channels.Channel) {

        this.data.channel.dataModel = e;

    } else if (e instanceof Gui.Window.Controller.Recording) {

        this.data.recording = e.data;
        this.data.channel = undefined;
        this.data.url = e.streamUrl;

    } else if (e instanceof jQuery.Event) {

        channels = VDRest.app.getModule('VDRest.Epg').getModel('Channels');
        getter = $(e.target).hasClass('channel-up') ? 'Next' : 'Previous';
        this.data.recording = undefined;
        this.data.channel.dataModel = channels['get' + getter + 'Channel'](this.data.channel.dataModel);
    }

    this.getVideo().pause();
    this.getVideo().src = false;

    setTimeout(function () {
        me.startPlayback(true);
    }, 500);
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
 * destroy
 */
Gui.Window.Controller.VideoPlayer.prototype.destructView = function () {

    Gui.Window.Controller.Abstract.prototype.destructView.call(this);
    this.module.cache.invalidateAllTypes(this);
    this.module.unsetVideoPlayer();
};