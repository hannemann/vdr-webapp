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

    if (this.data.sourceModel instanceof VDRest.Epg.Model.Channels.Channel) {

        this.data.isTv = true;
        now = parseInt(new Date().getTime() / 1000, 10);
        broadcast = this.data.sourceModel.getCurrentBroadcast();
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

    VDRest.app.getModule('Gui.Epg').mute();

    this.addObserver();

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    this.data.isVideo && this.module.getHelper('VideoPlayer').setVideoPoster(this.getPosterOptions(2));
};

/**
 * add event listeners
 */
Gui.Window.Controller.VideoPlayer.prototype.addObserver = function () {

    var helper = this.helper();

    this.view.volumeWrapper.on('mousedown touchstart', $.proxy(this.volumeDown, this));
    this.view.volumeWrapper.on('click', helper.stopPropagation);
    this.view.sizeSelect.on('mousedown touchstart', $.proxy(this.qualitySelectDown, this));
    this.view.bitrateSelect.on('mousedown touchstart', $.proxy(this.qualitySelectDown, this));
    this.view.controls.on('click.'+this.keyInCache, $.proxy(this.toggleControls, this));
    this.view.ctrlQuality.on('click.'+this.keyInCache, $.proxy(this.toggleQuality, this));
    this.view.ctrlStop.on('click.'+this.keyInCache, $.proxy(this.stopPlayback, this));
    this.view.ctrlPlay.on('click.'+this.keyInCache, $.proxy(this.togglePlayback, this));
    this.view.ctrlFullScreen.on('click.'+this.keyInCache, $.proxy(this.toggleFullScreen, this));
    this.view.ctrlMinimize.on('click.'+this.keyInCache, $.proxy(this.toggleMinimize, this));
    this.view.player.on('timeupdate', $.proxy(this.view.updateProgress, this.view));
    this.view.player.on('stalled', $.proxy(this.handleStalled, this));
    this.addOsdObserver();
    this.addDownloadEvent();

    if (this.data.isTv) {
        this.addZappObserver();
    } else {
        $(this.view.player).one(
            'playing',
            $.proxy(this.view.updateRecordingStartEndTime, this.view)
        );
    }
};

/**
 * add event listeners for zapping
 */
Gui.Window.Controller.VideoPlayer.prototype.addZappObserver = function () {

    this.view.ctrlChannelUp.on('click.'+this.keyInCache, $.proxy(this.changeSrc, this));
    this.view.ctrlChannelDown.on('click.'+this.keyInCache, $.proxy(this.changeSrc, this));
};

/**
 * add osd related event listeners
 */
Gui.Window.Controller.VideoPlayer.prototype.addOsdObserver = function () {

    this.view.osd.on('mouseup touchend', $.proxy(this.toggleControls, this));
    this.view.osd.on('touchstart mousedown', $.proxy(this.setTimeDown, this));
};

/**
 * add download event listener
 */
Gui.Window.Controller.VideoPlayer.prototype.addDownloadEvent = function () {

    if ("undefined" !== typeof this.view.ctrlDownload) {
        this.view.ctrlDownload.on('click', $.proxy(this.startDownload, this));
    }
};

/**
 * remove event listeners
 */
Gui.Window.Controller.VideoPlayer.prototype.removeObserver = function () {

    this.view.ctrlVolume.off('mousedown touchstart');
    this.view.ctrlVolume.off('click');
    this.view.ctrlVolume.off('click');
    this.view.sizeSelect.off('mousedown touchstart');
    this.view.bitrateSelect.off('mousedown touchstart');
    this.view.controls.off('click');
    this.view.ctrlStop.off('click');
    this.view.ctrlPlay.off('click');
    this.view.ctrlFullScreen.off('click');
    this.view.ctrlQuality.off('click');
    this.view.ctrlMinimize.off('click');
    this.view.player.off('playing');
    this.view.player.off('timeupdate');
    this.view.player.off('stalled');
    this.removeOsdObserver();
    if (this.data.isTv) {
        this.removeZappObserver();
    } else {
        this.removeDownloadEvent();
    }
};

/**
 * remove event listeners for zapping
 */
Gui.Window.Controller.VideoPlayer.prototype.removeZappObserver = function () {

    if ("undefined" !== typeof this.view.ctrlChannelUp) {
        this.view.ctrlChannelUp.off('click');
        this.view.ctrlChannelDown.off('click');
    }
};

/**
 * remove osd related event listeners
 */
Gui.Window.Controller.VideoPlayer.prototype.removeOsdObserver = function () {

    this.view.osd.off('mouseup touchend');
    this.view.osd.off('mousedown touchstart');
};

/**
 * toggle controls
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.VideoPlayer.prototype.toggleControls = function (e) {

    if ("undefined" === typeof this.stopToggleControls) {

        clearTimeout(this.spoolTimeout);
        e.stopPropagation();
        e.preventDefault();
        this.view.toggleControls();
    }

    this.stopToggleControls = undefined;
};

/**
 * toggle quality
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.VideoPlayer.prototype.toggleQuality = function (e) {

    if (!this.view.controls.hasClass('show')) return;

    this.vibrate();

    e.stopPropagation();
    e.preventDefault();
    this.view.toggleQuality();
};

/**
 * remove osd related event listeners
 */
Gui.Window.Controller.VideoPlayer.prototype.removeDownloadEvent = function () {

    if ("undefined" !== typeof this.view.ctrlDownload) {
        this.view.ctrlDownload.off('click');
    }
};

/**
 * retrieve options object for poster extraction
 * @param {int} [time]
 * @returns {{
 *      width: int,
 *      height: int,
 *      video: HTMLVideoElement,
 *      sourceModel: VDRest.Recordings.Model.List.Recording|VDRest.Epg.Model.Channels.Channel,
 *      startTime: int
 *  }}
 */
Gui.Window.Controller.VideoPlayer.prototype.getPosterOptions = function (time) {

    var size = this.view.sizeList.find('.item.selected').text();
    time = time || this.getData('startTime');

    return {
        "width" : this.view.sizes[size].width,
        "height" : this.view.sizes[size].height,
        "video" : this.getVideo(),
        "sourceModel" : this.data.sourceModel,
        "startTime" : time
    }
};

/**
 * start download of recording
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.VideoPlayer.prototype.startDownload = function (e) {

    var filename = encodeURIComponent(
                this.data.sourceModel.getData('name')
            ) + '.' + VDRest.config.getItem('streamdevContainer'),
        src = this.getStreamUrl(['FILENAME=' + filename], 'download');

    if (!this.view.controls.hasClass('show')) {
        return;
    }
    e.preventDefault();
    e.stopPropagation();

    location.href = src;

};

/**
 * try to prevent browser from getting unresponsive in case the video stalls
 */
Gui.Window.Controller.VideoPlayer.prototype.handleStalled = function () {

    var me = this;

    this.view.toggleThrobber();
    this.view.player.one('timeupdate', function () {
        me.view.toggleThrobber();
    });
};

/**
 * handle quality selector down
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.VideoPlayer.prototype.qualitySelectDown = function (e) {

    if (!this.view.controls.hasClass('show') || !this.view.qualitySelect.hasClass('show')) {
        return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.view.stopHideControls();
    if (this.isPlaying) {
        this.pausePlayback();
    }
    this.settingParams = true;
    this.view.omitToggleControls = true;

    if ($(e.currentTarget).hasClass('size-select')) {
        this.currentQualitySelect = this.view.sizeSelect;
    } else  {
        this.currentQualitySelect = this.view.bitrateSelect;
    }
    this.view.toggleQualityControlActiveState(this.currentQualitySelect);

    if ('touchstart' === e.type) {
        this.qualityTouchPos = e.originalEvent.changedTouches[0].pageY;
    } else {
        this.qualityTouchPos = e.pageY;
    }
    this.qualityDelta = 0;

    $(document).on('mousemove.qualityselect touchmove.qualitySelect', $.proxy(this.qualitySelectMove, this));
    $(document).one('mouseup.qualitySelect touchend.qualitySelect', $.proxy(this.qualitySelectUp, this));
};

/**
 * handle quality selector up
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.VideoPlayer.prototype.qualitySelectUp = function (e) {

    if (e instanceof jQuery.Event) {
        e.preventDefault();
        e.stopPropagation();
    }

    VDRest.config.setItem(
            'videoQualitySize',
        this.view.sizeSelect.find('.item.selected').text()
    );
    VDRest.config.setItem(
        'videoQualityBitrate',
        this.view.bitrateSelect.find('.item.selected').text()
    );

    $(document).off('mousemove.qualityselect touchmove.qualitySelect');
    $(document).off('mouseup.qualitySelect touchend.qualitySelect');
    this.view.toggleQualityControlActiveState(this.currentQualitySelect);
    this.currentQualitySelect = undefined;
    this.qualityTouchPos = undefined;
    this.qualityDelta = undefined;
};

/**
 * handle quality selector move
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.VideoPlayer.prototype.qualitySelectMove = function (e) {

    var itemList = this.currentQualitySelect.find('.item-list'),
        current = itemList.find('.item.selected'),
        me = this;

    e.preventDefault();
    e.stopPropagation();

    this.qualityDelta = (
        e.type === 'touchmove'
            ? e.originalEvent.changedTouches[0].pageY
            : e.pageY
    ) - this.qualityTouchPos;

    if (Math.abs(this.qualityDelta) > 24 && !this.qualityAnimating) {
        this.qualityAnimating = true;
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
        }, function () {
            me.qualityTouchPos = e.type === 'touchmove'
                ? e.originalEvent.changedTouches[0].pageY
                : e.pageY;
            me.qualityAnimating = false;
        });
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

    this.view.toggleQuality(false);

    e.stopPropagation();
    e.preventDefault();
    $(document).one('mouseup.videoplayer-volume touchend.videoplayer-volume', $.proxy(this.volumeUp, this));

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
    this.isAllowedUpdateVolume = false;
    this.view.volumeIndicator.on(this.transitionEndEvents, $.proxy(function () {
        this.view.volumeIndicator.off(this.transitionEndEvents);
        this.isAllowedUpdateVolume = true;
    }, this));
    this.view.toggleVolumeIndicator(true);
    this.view.toggleVolumeSliderActiveState();
    this.vibrate();
};

/**
 * handle stop volume change
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.VideoPlayer.prototype.volumeUp = function (e) {

    e.stopPropagation();
    e.preventDefault();
    this.view.isAllowedUpdateVolume = undefined;
    $(document).off('mousemove.videoplayer-volume touchmove.videoplayer-volume');
    $(document).off('mouseup.videoplayer-volume touchend.videoplayer-volume');
    this.view.toggleVolumeIndicator(false);
    this.view.toggleVolumeSliderActiveState();
};

/**
 * handle volume change
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.VideoPlayer.prototype.volumeMove = function (e) {

    var newPos;

    if (!this.isAllowedUpdateVolume) {
        return;
    }

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

    if (!this.view.controls.hasClass('show') || this.data.isTv) {
        return;
    }

    e.stopPropagation();
    e.preventDefault();

    this.spoolTimeout = setTimeout($.proxy(this.spool, this), 2000);

    this.view.stopHideControls();
    if (this.isPlaying) {
        this.pausePlayback();
    }
    this.settingParams = true;
    if ('touchstart' === e.type) {
        this.timelineSlidePos = e.originalEvent.changedTouches[0].pageX;
        $(document).one('touchend.videoplayer-time', $.proxy(this.setTimeUp, this));
    } else {
        this.timelineSlidePos = e.pageX;
        $(document).one('mouseup.videoplayer-time', $.proxy(this.setTimeUp, this));
    }
    this.timelineDownPos = this.timelineSlidePos;
    $(document).on('mousemove.videoplayer-time touchmove.videoplayer-time', $.proxy(this.setTimeMove, this));
    this.view.toggleTimeLineActiveState();
    this.vibrate();
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
    $(document).off('touchend.videoplayer-time mouseup.videoplayer-time');

    if ("undefined" !== typeof this.fetchPoster) {
        this.module.getHelper('VideoPlayer')
            .setVideoPoster(this.getPosterOptions());

        this.fetchPoster = undefined;
    }
    this.view.toggleTimeLineActiveState();
};

/**
 * handle move startTime
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.VideoPlayer.prototype.setTimeMove = function (e) {

    var newPos;

    this.stopToggleControls = true;
    this.fetchPoster = true;

    e.stopPropagation();
    e.preventDefault();
    newPos = e.type === 'touchmove'
        ? e.originalEvent.changedTouches[0].pageX
        : e.pageX;

    if (Math.abs(newPos - this.timelineDownPos) > 2) {
        clearTimeout(this.spoolTimeout);
    }

    this.setTime(newPos >= this.timelineSlidePos ? 'increase' : 'decrease');
    this.timelineSlidePos = newPos;
};

/**
 * set start time
 * @param {String} action
 * @param {Number} [value]
 */
Gui.Window.Controller.VideoPlayer.prototype.setTime = function (action, value) {

    var sourceModel = this.data.sourceModel;

    value = value || 1;
    if (action === 'increase') {
        this.data.startTime +=value;
    } else {
        this.data.startTime -= value;
    }
    if (this.data.startTime < 0) {
        this.data.startTime = 0;
    }
    if (this.data.startTime > sourceModel.getData('duration')) {
        this.data.startTime = sourceModel.getData('duration');
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

    this.vibrate(100);

    this.stopToggleControls = true;
    this.fetchPoster = true;

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

    if (this.data.isTv && this.isPlaying) return;

    this.vibrate();

    e.stopPropagation();

    this[this.isPlaying ? 'pausePlayback' : 'startPlayback']();
};

/**
 * toggle minimize
 */
Gui.Window.Controller.VideoPlayer.prototype.toggleMinimize = function (e) {

    var me = this;

    if (!this.view.controls.hasClass('show') && !this.data.isMinimized) {
        return;
    }

    if (e instanceof jQuery.Event) {
        e.stopPropagation();
    }

    this.vibrate();

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

    var video = this.getVideo();

    this.isPlaying = true;
    this.view.toggleThrobber();
    this.view.omitToggleControls = false;
    this.view.toggleControls();
    this.settingParams = false;

    video.src = this.getStreamUrl();
    video.play();

    $(video).one('playing', $.proxy(function () {
        this.view.toggleThrobber();
        if (this.data.isVideo) {
            this.view.ctrlPlay.html(this.view.symbolPause).addClass('pause');
            this.view.updateRecordingEndTime(false);
        }
    }, this));
};

/**
 * retrieve stream url
 * @param {Array} [streamdevParams]
 * @param {String} [type]
 * @returns {String}
 */
Gui.Window.Controller.VideoPlayer.prototype.getStreamUrl = function (streamdevParams, type) {

    var size = this.view.sizeList.find('.item.selected').text(),
        bitrate = this.view.bitrateList.find('.item.selected').text(),
        duration, src, d = new Date();

    streamdevParams = streamdevParams || [];

    type = type || VDRest.config.getItem('streamdevContainer');

    streamdevParams.push('TYPE=' + type);
    streamdevParams.push('WIDTH=' + this.view.sizes[size].width);
    streamdevParams.push('HEIGHT=' + this.view.sizes[size].height);
    streamdevParams.push('VBR=' + bitrate);

    if (this.data.isVideo) {
        duration = this.data.sourceModel.getData('duration');
        streamdevParams.push(
            'DUR=' + (this.data.startTime ? duration - this.data.startTime : duration).toString()
        );
    }
    src = this.data.sourceModel.getStreamUrl(streamdevParams);
    if (this.data.startTime > 0) {
        src += '?pos=time.' + this.data.startTime;
    }
    src += (src.indexOf('?') > -1 ? '&' : '?') + 'd=' + d.getTime() + d.getMilliseconds();

    return src;
};

/**
 * pause playback
 */
Gui.Window.Controller.VideoPlayer.prototype.pausePlayback = function () {

    var video = this.getVideo();

    this.view.stopHideControls();

    if (this.data.isVideo) {
        this.data.startTime = Math.floor(this.data.startTime + this.getVideo().currentTime);
        this.view.updateRecordingEndTime(true);
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

    this.vibrate();

    e.stopPropagation();

    history.back();
};

/**
 * change video source
 * @param {VDRest.Epg.Model.Channels.Channel|Gui.Window.Controller.Recording|jQuery.Event} e
 */
Gui.Window.Controller.VideoPlayer.prototype.changeSrc = function (e) {

    var channels, getter, nextChannel, video = this.getVideo(), now, broadcast;

    if (e instanceof jQuery.Event) {
        e.preventDefault();
        e.stopPropagation();
    }

    this.view.stopHideControls();
    this.removeDownloadEvent();

    if (
        !$('body').hasClass('video-minimized')
        && !this.view.controls.hasClass('show')
    ) {
        return;
    }

    if (this.data.sourceModel == e) {
        return;
    }
    if (this.isPlaying) {
        this.pausePlayback();
    }
    this.view.setDefaultPoster();

    if (e instanceof jQuery.Event) {

        this.vibrate();

        channels = VDRest.app.getModule('VDRest.Epg').getModel('Channels');
        getter = $(e.target).hasClass('channel-up') ? 'Next' : 'Previous';
        nextChannel = channels['get' + getter + 'Channel'](this.data.sourceModel);
        if (nextChannel) {
            this.data.sourceModel = nextChannel;
        } else {
            return;
        }
    } else {
        this.data.sourceModel = e;
    }

    if (this.data.sourceModel instanceof VDRest.Epg.Model.Channels.Channel) {
        now = parseInt(new Date().getTime() / 1000, 10);
        broadcast = this.data.sourceModel.getCurrentBroadcast();
        if (broadcast) {
            this.setIsTv();
            this.removeDownloadEvent();
            this.view.removeDownloadButton();
            this.view.addChannelButtons();
            this.removeZappObserver();
            this.addZappObserver();
            this.data.startTime = now - broadcast.getData('start_time');
            this.view.setData('startTime', this.data.startTime);
        } else {
            return;
        }
    } else if (this.data.sourceModel instanceof VDRest.Recordings.Model.List.Recording) {

        this.setIsVideo();
        this.data.startTime = 0;
        this.view.setData('startTime', this.data.startTime);
        this.removeZappObserver();
        this.view.removeChannelButtons();
        this.view.addDownloadButton();
        this.addDownloadEvent();
        $(video).one(
            'playing',
            $.proxy(this.view.updateRecordingStartEndTime, this.view)
        );
    } else {
        return;
    }
    this.view.updateRecordingEndTime(false);

    this.data.isVideo && this.module.getHelper('VideoPlayer').setVideoPoster(this.getPosterOptions(2));
    this.removeOsdObserver();
    this.view.initOsd();
    this.addOsdObserver();
};

/**
 * indicate that stream is recording
 */
Gui.Window.Controller.VideoPlayer.prototype.setIsVideo = function () {

    this.data.isTv = false;
    this.data.isVideo = true;
    this.view.data.isTv = this.data.isTv;
    this.view.data.isVideo = this.data.isVideo;
};

/**
 * indicate that stream is live tv
 */
Gui.Window.Controller.VideoPlayer.prototype.setIsTv = function () {

    this.data.isTv = true;
    this.data.isVideo = false;
    this.view.data.isTv = this.data.isTv;
    this.view.data.isVideo = this.data.isVideo;
};

/**
 * toggle fullscreen
 */
Gui.Window.Controller.VideoPlayer.prototype.toggleFullScreen = function (e) {

    if (!this.view.controls.hasClass('show')) {
        return;
    }

    e.stopPropagation();

    this.vibrate();

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

    this.view.ctrlFullScreen.html(this.view.symbolExitFullscreen);
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
    this.view.ctrlFullScreen.html(this.view.symbolFullscreen);
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

    VDRest.app.getModule('Gui.Epg').unMute();
};