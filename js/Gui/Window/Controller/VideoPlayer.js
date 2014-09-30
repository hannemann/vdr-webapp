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

    var now, broadcast;

    this.module.setVideoPlayer(this);
    this.eventPrefix = 'window.videoplayer';
    this.data.isTv = false;
    this.data.isVideo = false;
    this.data.isMinimized = false;
    this.data.startTime = 0;
    this.data.progress = '0:00:00';
    this.settingParams = false;
    this.spooling = false;

    if ("undefined" !== typeof this.data.channel) {

        this.data.isTv = true;
        now = parseInt(new Date().getTime() / 1000, 10);
        broadcast = this.getData('channel').getCurrentBroadcast();
        this.data.startTime = now - broadcast.getData('start_time');
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

    $(window).on('orientationchange.'+this.keyInCache, $.proxy(this.view.setPosition, this.view));
    $(this.view.ctrlVolume).on('mousedown touchstart', $.proxy(this.volumeDown, this));
    $(this.view.ctrlTimeline).on('mousedown touchstart', $.proxy(this.setTimeDown, this));

    $(this.view.sizeSelect)
        .on('touchstart', $.proxy(this.qualitySelectDown, this));
    $(this.view.bitrateSelect)
        .on('touchstart', $.proxy(this.qualitySelectDown, this));

    this.view.controls.on('click.'+this.keyInCache, $.proxy(this.view.toggleControls, this.view));
    this.view.ctrlStop.on('click.'+this.keyInCache, $.proxy(this.stopPlayback, this));
    this.view.ctrlPlay.on('click.'+this.keyInCache, $.proxy(this.togglePlayback, this));
    this.view.ctrlFullScreen.on('click.'+this.keyInCache, $.proxy(this.toggleFullScreen, this));
    this.view.ctrlMinimize.on('click.'+this.keyInCache, $.proxy(this.toggleMinimize, this));
    this.view.player.on('timeupdate', $.proxy(this.view.updateProgress, this.view));

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
    $(this.view.ctrlVolume).off('mousedown touchstart');
    $(this.view.ctrlTimeline).off('mousedown touchstart');
    $(this.view.ctrlTimeline).off('dblclick');
    $(this.view.controls).off('click');
    $(this.view.stop).off('click');
    this.view.ctrlPlay.on('click');
    this.view.ctrlFullScreen.on('click');
    this.view.ctrlMinimize.on('click');
    this.view.player.off('timeupdate');
    if (this.data.isTv) {
        this.view.ctrlChannelUp.off('click');
        this.view.ctrlChannelDown.off('click');
    }
};

Gui.Window.Controller.VideoPlayer.prototype.qualitySelectDown = function (e) {

    if (!this.view.controls.hasClass('show')) {
        return;
    }
    e.preventDefault();
    e.stopPropagation();
    if (this.isPlaying) {
        this.pausePlayback();
    }
    this.settingParams = true;

    if ($(e.currentTarget).hasClass('size-select')) {
        this.currentQualitySelect = this.view.sizeSelect;
    } else  {
        this.currentQualitySelect = this.view.bitrateSelect;
    }

    this.qualityTouchPos = e.originalEvent.changedTouches[0].pageY;
    this.qualityDelta = 0;

    $(document).on('touchmove.qualitySelect', $.proxy(this.qualitySelectMove, this));
    $(document).one('touchend', $.proxy(this.qualitySelectUp, this));
};

Gui.Window.Controller.VideoPlayer.prototype.qualitySelectUp = function (e) {

    if (e instanceof jQuery.Event) {
        e.preventDefault();
        e.stopPropagation();
    }

    $(document).off('touchmove.qualitySelect');
    this.currentQualitySelect = undefined;
    this.qualityTouchPos = undefined;
    this.qualityDelta = undefined;
};

Gui.Window.Controller.VideoPlayer.prototype.qualitySelectMove = function (e) {

    var itemList = this.currentQualitySelect.find('.item-list'),
        current = itemList.find('.item.selected');

    e.preventDefault();
    e.stopPropagation();

    this.qualityDelta = e.originalEvent.changedTouches[0].pageY
            - this.qualityTouchPos;

    if (Math.abs(this.qualityDelta) > 24) {
        if (this.qualityDelta > 0) {

            if (current.prev().get(0)) {
                current.removeClass('selected');
                current.prev().addClass('selected')
            }

        } else {

            if (current.next().get(0)) {
                current.removeClass('selected');
                current.next().addClass('selected')
            }
        }

        itemList.animate({
            "top" : - itemList.find('.item.selected').position().top + 'px'
        });
        this.qualitySelectUp();
    }
};

/**
 * handle start volume change
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.VideoPlayer.prototype.volumeDown = function (e) {

    if (!this.view.controls.hasClass('show')) {
        return;
    }

    e.stopPropagation();
    e.preventDefault();
    $(document).one('mouseup touchend', $.proxy(this.volumeUp, this));

    this.view.stopHideControls();
    if ('touchstart' === e.type) {
        this.volumeSlidePos = e.originalEvent.changedTouches[0].pageY;
    } else {
        this.volumeSlidePos = e.pageY;
    }
    $(document).on(
        'mousemove.videoplayer-volume touchmove.videoplayer-volume',
        $.proxy(this.volumeMove, this)
    );
    this.view.volumeIndicator.show();
};

/**
 * handle stop volume change
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.VideoPlayer.prototype.volumeUp = function (e) {

    e.stopPropagation();
    e.preventDefault();
    $(document).off('mousemove.videoplayer-volume touchmove.videoplayer-volume');
    this.view.volumeIndicator.hide();
};

/**
 * handle volume change
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.VideoPlayer.prototype.volumeMove = function (e) {

    var newPos;

    e.stopPropagation();
    e.preventDefault();
    newPos = e.type === 'touchmove'
        ? e.originalEvent.changedTouches[0].pageY
        : e.pageY;

    this.setVolume(newPos >= this.volumeSlidePos ? 'decrease' : 'increase');
    this.volumeSlidePos = newPos;
};

/**
 * set actual volume
 * @param {string} action
 */
Gui.Window.Controller.VideoPlayer.prototype.setVolume = function (action) {

    var video = this.getVideo(), vol = video.volume, value = 0.02;

    if ('increase' == action) {

        video.volume = vol + value > 1 ? 1 : vol + value;
    } else {

        video.volume = vol - value < 0 ? 0 : vol - value;
    }
    VDRest.config.setItem('html5VideoPlayerVol', video.volume);
    this.view.setVolumeSliderHeight();
};

/**
 * handle start startTime change
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.VideoPlayer.prototype.setTimeDown = function (e) {

    if (!this.view.controls.hasClass('show') || this.getData('channel')) {
        return;
    }

    e.stopPropagation();
    e.preventDefault();

    this.spoolTimeout = setTimeout($.proxy(this.spool, this), 1000);

    $(document).one('mouseup', $.proxy(this.setTimeUp, this));
    $(document).one('touchend', $.proxy(this.setTimeUp, this));

    this.view.stopHideControls();
    if (this.isPlaying) {
        this.pausePlayback();
    }
    this.settingParams = true;
    if ('touchstart' === e.type) {
        this.timelineSlidePos = e.originalEvent.changedTouches[0].pageX;
    } else {
        this.timelineSlidePos = e.pageX;
    }
    $(document).on('mousemove.videoplayer-time', $.proxy(this.setTimeMove, this));
    $(document).on('touchmove.videoplayer-time', $.proxy(this.setTimeMove, this));
};

/**
 * handle change startTime stop
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.VideoPlayer.prototype.setTimeUp = function (e) {

    clearTimeout(this.spoolTimeout);
    clearInterval(this.spoolInterval);
    clearInterval(this.increaseValueInterval);
    e.stopPropagation();
    e.preventDefault();
    $(document).off('mousemove.videoplayer-time touchmove.videoplayer-time');
};

/**
 * handle move startTime
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.VideoPlayer.prototype.setTimeMove = function (e) {

    var newPos;

    clearTimeout(this.spoolTimeout);
    e.stopPropagation();
    e.preventDefault();
    newPos = e.type === 'touchmove'
        ? e.originalEvent.changedTouches[0].pageX
        : e.pageX;

    this.setTime(newPos >= this.timelineSlidePos ? 'increase' : 'decrease');
    this.timelineSlidePos = newPos;
};

/**
 * set start time
 * @param {String} action
 * @param {Number} [value]
 */
Gui.Window.Controller.VideoPlayer.prototype.setTime = function (action, value) {

    var recording = this.getData('recording');

    value = value || 1;
    if (action === 'increase') {
        this.data.startTime +=value;
    } else {
        this.data.startTime -= value;
    }
    if (this.data.startTime < 0) {
        this.data.startTime = 0;
    }
    if (this.data.startTime > recording.getData('duration')) {
        this.data.startTime = recording.getData('duration');
    }
    this.view.setData('startTime', this.data.startTime);
    this.view.updateProgress(this.data.startTime);
};

/**
 * handle spooling
 */
Gui.Window.Controller.VideoPlayer.prototype.spool = function () {

    var me = this,
        slider = this.view.timelineSlider,
        timelinePos = slider.offset().left + slider.width();

    $(document).off('mousemove.videoplayer-time touchmove.videoplayer-time');

    this.spooling = 5;

    this.increaseValueInterval = setInterval(function () {

        me.spooling += 5;
    }, 1000);

    this.spoolInterval = setInterval(function () {
        me.setTime(
            me.timelineSlidePos > timelinePos ? 'increase' : 'decrease',
            me.spooling
        );
    }, 100);
};

/**
 * toggle playback
 */
Gui.Window.Controller.VideoPlayer.prototype.togglePlayback = function (e) {

    if (!this.view.controls.hasClass('show')) return;

    if (this.data.channel && this.isPlaying) return;

    e.stopPropagation();

    this[this.isPlaying ? 'pausePlayback' : 'startPlayback']();
};

/**
 * toggle minimize
 */
Gui.Window.Controller.VideoPlayer.prototype.toggleMinimize = function () {

    var me = this;

    if (!this.view.controls.hasClass('show') && !this.data.isMinimized) {
        return;
    }

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
Gui.Window.Controller.VideoPlayer.prototype.startPlayback = function () {

    var d = new Date(), src, video = this.getVideo(),
        streamdevParams = [],
        size = this.view.sizeList.find('.item.selected').text(),
        bitrate = this.view.bitrateList.find('.item.selected').text();

    streamdevParams.push('WIDTH=' + this.view.sizes[size].width);
    streamdevParams.push('HEIGHT=' + this.view.sizes[size].height);
    streamdevParams.push('VBR=' + bitrate);

    if (this.data.channel) {
        src = this.getData('channel').getStreamUrl(streamdevParams);
    } else if (this.data.recording) {
        src = this.data.recording.getStreamUrl(streamdevParams);
        if (this.data.startTime > 0) {
            src += '?pos=time.' + this.data.startTime;
        }
    }
    this.isPlaying = true;
    this.view.toggleThrobber();
    this.view.toggleControls();
    this.settingParams = false;

    src += (src.indexOf('?') > -1 ? '&' : '?') + 'd=' + d.getTime() + d.getMilliseconds();
    video.src = src;
    video.play();

    $(video).one('playing', $.proxy(function () {
        this.view.toggleThrobber();
        if (this.data.isVideo) {
            this.view.ctrlPlay.html(this.view.symbolPause).addClass('pause');
        }
    }, this));
};

/**
 * pause playback
 */
Gui.Window.Controller.VideoPlayer.prototype.pausePlayback = function () {

    var video = this.getVideo();

    if (this.data.recording) {
        this.data.startTime = Math.floor(this.data.startTime + this.getVideo().currentTime);
    }

    if (!this.settingParams) {
        video.poster = this.module.getHelper('VideoPlayer').captureFrame(video);
    }
    this.isPlaying = false;
    video.pause();
    video.src = false;
    this.view.ctrlPlay.html(this.view.symbolPlay).removeClass('pause');
};

/**
 * stop playback
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.VideoPlayer.prototype.stopPlayback = function (e) {

    if (!this.view.controls.hasClass('show')) {
        return;
    }

    e.stopPropagation();

    history.back();
};

/**
 * toggle fullscreen
 */
Gui.Window.Controller.VideoPlayer.prototype.toggleFullScreen = function () {

    if (!this.view.controls.hasClass('show')) {
        return;
    }

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
 * change video source
 * @param {VDRest.Epg.Model.Channels.Channel|Gui.Window.Controller.Recording|jQuery.Event} e
 */
Gui.Window.Controller.VideoPlayer.prototype.changeSrc = function (e) {

    var channels, getter, me = this, video = this.getVideo(), now, broadcast;

    if (
        !$('body').hasClass('video-minimized')
        && !this.view.controls.hasClass('show')
    ) {
        return;
    }

    if (e instanceof VDRest.Epg.Model.Channels.Channel) {

        this.data.recording = undefined;
        this.data.channel = e;

    } else if (e instanceof VDRest.Recordings.Model.List.Recording) {

        this.data.recording = e;
        this.data.channel = undefined;
        this.data.startTime = 0;

    } else if (e instanceof jQuery.Event) {

        channels = VDRest.app.getModule('VDRest.Epg').getModel('Channels');
        getter = $(e.target).hasClass('channel-up') ? 'Next' : 'Previous';
        this.data.recording = undefined;
        this.data.channel = channels['get' + getter + 'Channel'](this.data.channel);
    }

    if (this.getData('channel')) {
        now = parseInt(new Date().getTime() / 1000, 10);
        broadcast = this.getData('channel').getCurrentBroadcast();
        this.data.startTime = now - broadcast.getData('start_time');
        this.view.setData('startTime', this.data.startTime);
    }

    video.pause();
    video.src = false;
    this.view.addTitle();

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