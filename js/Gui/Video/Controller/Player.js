/**
 * @class
 * @constructor
 */
Gui.Video.Controller.Player = function () {
};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Video.Controller.Player.prototype = new Gui.Window.Controller.Abstract();

/**
 * @type {string}
 */
Gui.Video.Controller.Player.prototype.cacheKey = 'url';

/**
 * @type {string}
 */
Gui.Video.Controller.Player.prototype.noTimeUpdateWorkaround = true;

/**
 * initialize view
 */
Gui.Video.Controller.Player.prototype.init = function () {

    this.module.setVideoPlayer(this);
    this.eventPrefix = 'video.player';
    this.data.isTv = false;
    this.data.isVideo = false;
    this.data.isMinimized = false;
    this.data.startTime = 0;
    this.data.progress = '0:00:00';
    this.settingParams = false;
    this.spooling = false;

    this.view = this.module.getView('Player', this.data);

    this.video = this.module.getController('Player.Video', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);

    this.view.setParentView({
        "node" : $('body')
    });
};

/**
 * dispatch view
 */
Gui.Video.Controller.Player.prototype.dispatchView = function () {

    var callback = function () {

        VDRest.app.getModule('Gui.Epg').mute();

        Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);
        this.video.dispatchView();

        this.addObserver();

        this.data.isVideo && this.module.getHelper('Player').setVideoPoster(this.getPosterOptions(2));
    }.bind(this);

    if (this.data.sourceModel instanceof VDRest.Epg.Model.Channels.Channel) {

        this.data.isTv = true;
        this.data.sourceModel.getCurrentBroadcast(function (broadcast) {
            this.view.setData('current_broadcast', broadcast);
            this.data.startTime = parseInt(Date.now() / 1000, 10) - broadcast.getData('start_time');
            callback();
        }.bind(this));
    } else {
        this.data.isVideo = true;
        callback();
    }
};

/**
 * add event listeners
 */
Gui.Video.Controller.Player.prototype.addObserver = function () {

    this.view.volumeWrapper.on('mousedown touchstart', this.volumeDown.bind(this));
    this.view.volumeWrapper.on('click', VDRest.helper.stopPropagation);
    this.view.sizeSelect.on('mousedown touchstart', this.qualitySelectDown.bind(this));
    this.view.bitrateSelect.on('mousedown touchstart', this.qualitySelectDown.bind(this));
    this.view.controls.on('click.' + this.keyInCache, this.toggleControls.bind(this));
    this.view.ctrlQuality.on('click.' + this.keyInCache, this.toggleQuality.bind(this));
    this.view.ctrlStop.on('click.' + this.keyInCache, this.stopPlayback.bind(this));
    this.view.ctrlPlay.on('click.' + this.keyInCache, this.togglePlayback.bind(this));
    this.view.ctrlFullScreen.on('click.' + this.keyInCache, this.toggleFullScreen.bind(this));
    this.view.ctrlMinimize.on('click.' + this.keyInCache, this.toggleMinimize.bind(this));

    if (!this.noTimeUpdateWorkaround) {
        this.video.addTimeUpdateObserver(this.view.updateProgress.bind(this.view));
    }

    this.video.addStalledObserver(this.handleStalled.bind(this));

    this.addOsdObserver();
    this.addDownloadEvent();

    if (this.data.isTv) {
        this.addZappObserver();
    } else {
        this.video.addPlayObserver(this.view.updateRecordingStartEndTime.bind(this.view), true);
        this.addCutObserver();
    }
};

/**
 * add event listeners for zapping
 */
Gui.Video.Controller.Player.prototype.addZappObserver = function () {

    this.view.ctrlChannelUp.on('click.' + this.keyInCache, this.changeSrc.bind(this));
    this.view.ctrlChannelDown.on('click.' + this.keyInCache, this.changeSrc.bind(this));
};

/**
 * add event listeners for zapping
 */
Gui.Video.Controller.Player.prototype.addCutObserver = function () {

    this.view.ctrlCut.on('click.' + this.keyInCache, this.startCutting.bind(this));
};

/**
 * add osd related event listeners
 */
Gui.Video.Controller.Player.prototype.addOsdObserver = function () {

    this.view.osd.on(VDRest.helper.pointerEnd, this.toggleControls.bind(this));
    this.view.osd.on(VDRest.helper.pointerStart, this.setTimeDown.bind(this));
};

/**
 * add download event listener
 */
Gui.Video.Controller.Player.prototype.addDownloadEvent = function () {

    if ("undefined" !== typeof this.view.ctrlDownload) {
        this.view.ctrlDownload.on('click', this.startDownload.bind(this));
    }
};

/**
 * remove event listeners
 */
Gui.Video.Controller.Player.prototype.removeObserver = function () {

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
    this.removeOsdObserver();
    if (this.data.isTv) {
        this.removeZappObserver();
    } else {
        this.removeDownloadEvent();
        this.removeCutObserver();
    }
};

/**
 * remove event listeners for zapping
 */
Gui.Video.Controller.Player.prototype.removeZappObserver = function () {

    if ("undefined" !== typeof this.view.ctrlChannelUp) {
        this.view.ctrlChannelUp.off('click');
        this.view.ctrlChannelDown.off('click');
    }
};

/**
 * remove event listeners for zapping
 */
Gui.Video.Controller.Player.prototype.removeCutObserver = function () {

    if ("undefined" !== typeof this.view.ctrlCut) {
        this.view.ctrlCut.off('click');
    }
};

/**
 * remove osd related event listeners
 */
Gui.Video.Controller.Player.prototype.removeOsdObserver = function () {

    this.view.osd.off(VDRest.helper.pointerEnd);
    this.view.osd.off(VDRest.helper.pointerStart);
};

/**
 * toggle controls
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.prototype.toggleControls = function (e) {

    if (this.oldChannelId && this.oldChannelId !== this.data.sourceModel.getData('channel_id')) {
        this.data.sourceModel = VDRest.app.getModule('VDRest.Epg').getModel('Channels.Channel', this.oldChannelId);
        this.oldChannelId = undefined;
        this.data.sourceModel.getCurrentBroadcast(function (broadcast) {
            this.view.setData('current_broadcast', broadcast);
            this.view.initOsd();
        }.bind(this));
    }

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
Gui.Video.Controller.Player.prototype.toggleQuality = function (e) {

    if (!this.view.controls.hasClass('show')) return;

    this.vibrate();

    e.stopPropagation();
    e.preventDefault();
    this.view.toggleQuality();
};

/**
 * remove osd related event listeners
 */
Gui.Video.Controller.Player.prototype.removeDownloadEvent = function () {

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
Gui.Video.Controller.Player.prototype.getPosterOptions = function (time) {

    var size = this.view.sizeList.find('.item.selected').text();
    time = time || this.getData('startTime');

    return {
        "width" : this.view.sizes[size].width,
        "height" : this.view.sizes[size].height,
        "video" : this.video.view.node[0],
        "sourceModel" : this.data.sourceModel,
        "startTime" : time
    }
};

/**
 * start download of recording
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.prototype.startDownload = function (e) {

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
Gui.Video.Controller.Player.prototype.handleStalled = function () {

    // baw.
    if (this.noTimeUpdateWorkaround) {
        return;
    }

    var me = this;

    this.view.toggleThrobber();
    this.video.addTimeUpdateObserver(function () {
        me.view.toggleThrobber();
    }, true);
};

/**
 * handle quality selector down
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.prototype.qualitySelectDown = function (e) {

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

    $document.on('mousemove.qualityselect touchmove.qualitySelect', this.qualitySelectMove.bind(this));
    $document.one('mouseup.qualitySelect touchend.qualitySelect', this.qualitySelectUp.bind(this));
};

/**
 * handle quality selector up
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.prototype.qualitySelectUp = function (e) {

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

    $document.off('mousemove.qualityselect touchmove.qualitySelect');
    $document.off('mouseup.qualitySelect touchend.qualitySelect');
    this.view.toggleQualityControlActiveState(this.currentQualitySelect);
    this.currentQualitySelect = undefined;
    this.qualityTouchPos = undefined;
    this.qualityDelta = undefined;
};

/**
 * handle quality selector move
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.prototype.qualitySelectMove = function (e) {

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
Gui.Video.Controller.Player.prototype.volumeDown = function (e) {

    if (!this.view.controls.hasClass('show')) {
        return;
    }

    this.view.toggleQuality(false);

    e.stopPropagation();
    e.preventDefault();
    $document.one('mouseup.videoplayer-volume touchend.videoplayer-volume', this.volumeUp.bind(this));

    this.view.stopHideControls();
    if ('touchstart' === e.type) {
        this.volumeSlidePos = e.originalEvent.changedTouches[0].pageY;
    } else {
        this.volumeSlidePos = e.pageY;
    }
    $document.on(
        'mousemove.videoplayer-volume touchmove.videoplayer-volume',
        this.volumeMove.bind(this)
    );
    this.isAllowedUpdateVolume = false;
    this.view.volumeIndicator.on(this.transitionEndEvents, function () {
        this.view.volumeIndicator.off(this.transitionEndEvents);
        this.isAllowedUpdateVolume = true;
    }.bind(this));
    this.view.toggleVolumeIndicator(true);
    this.view.toggleVolumeSliderActiveState();
    this.vibrate();
};

/**
 * handle stop volume change
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.prototype.volumeUp = function (e) {

    e.stopPropagation();
    e.preventDefault();
    this.view.isAllowedUpdateVolume = undefined;
    $document.off('mousemove.videoplayer-volume touchmove.videoplayer-volume');
    $document.off('mouseup.videoplayer-volume touchend.videoplayer-volume');
    this.view.toggleVolumeIndicator(false);
    this.view.toggleVolumeSliderActiveState();
};

/**
 * handle volume change
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.prototype.volumeMove = function (e) {

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
Gui.Video.Controller.Player.prototype.setVolume = function (action) {

    var vol = this.video.getVolume(),
        value = 0.01;

    if ('increase' == action) {

        this.video.setVolume(vol + value > 1 ? 1 : vol + value);
    } else {

        this.video.setVolume(vol - value < 0 ? 0 : vol - value);
    }
    VDRest.config.setItem('html5VideoPlayerVol', this.video.getVolume());
    this.view.setVolumeSliderHeight();
};

/**
 * handle start startTime change
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.prototype.setTimeDown = function (e) {

    if (!this.view.controls.hasClass('show') || this.data.isTv) {
        return;
    }

    e.stopPropagation();
    e.preventDefault();

    this.spoolTimeout = setTimeout(this.spool.bind(this), 2000);

    this.view.stopHideControls();
    if (this.isPlaying) {
        this.pausePlayback();
    }
    this.settingParams = true;
    if ('touchstart' === e.type) {
        this.timelineSlidePos = e.originalEvent.changedTouches[0].pageX;
        $document.one('touchend.videoplayer-time', this.setTimeUp.bind(this));
    } else {
        this.timelineSlidePos = e.pageX;
        $document.one('mouseup.videoplayer-time', this.setTimeUp.bind(this));
    }
    this.timelineDownPos = this.timelineSlidePos;
    $document.on('mousemove.videoplayer-time touchmove.videoplayer-time', this.setTimeMove.bind(this));
    this.view.toggleTimeLineActiveState();
    this.vibrate();
};

/**
 * handle change startTime stop
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.prototype.setTimeUp = function (e) {

    clearTimeout(this.spoolTimeout);
    clearInterval(this.spoolInterval);
    clearInterval(this.increaseValueInterval);
    e.stopPropagation();
    e.preventDefault();

    $document.off('mousemove.videoplayer-time touchmove.videoplayer-time');
    $document.off('touchend.videoplayer-time mouseup.videoplayer-time');

    if ("undefined" !== typeof this.fetchPoster) {
        this.module.getHelper('Player')
            .setVideoPoster(this.getPosterOptions());

        this.fetchPoster = undefined;
    }
    this.view.toggleTimeLineActiveState();
};

/**
 * handle move startTime
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.prototype.setTimeMove = function (e) {

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
Gui.Video.Controller.Player.prototype.setTime = function (action, value) {

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
Gui.Video.Controller.Player.prototype.spool = function () {

    var me = this,
        slider = this.view.timelineSlider,
        timelinePos = slider.offset().left + slider.width();

    this.vibrate(100);

    this.stopToggleControls = true;
    this.fetchPoster = true;

    $document.off('mousemove.videoplayer-time touchmove.videoplayer-time');

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
Gui.Video.Controller.Player.prototype.togglePlayback = function (e) {

    if (!this.view.controls.hasClass('show')) return;

    this.vibrate();

    e.stopPropagation();

    if (this.data.isTv && this.isPlaying) {
        this.startPlayback();
        return;
    }

    this[this.isPlaying ? 'pausePlayback' : 'startPlayback']();
};

/**
 * toggle minimize
 */
Gui.Video.Controller.Player.prototype.toggleMinimize = function (e) {

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
Gui.Video.Controller.Player.prototype.startPlayback = function () {

    if (this.isPlaying) {
        if (this.oldChannelId && this.oldChannelId === this.data.sourceModel.getData('channel_id')) {
            return;
        }
        if (this.oldChannelId) {
            this.oldChannelId = undefined;
        }
        this.pausePlayback();
    }

    this.isPlaying = true;
    this.view.toggleThrobber();
    this.view.omitToggleControls = false;
    this.view.toggleControls();
    this.settingParams = false;

    this.video.play(this.getStreamUrl());

    this.video.addPlayObserver(function () {

        var currentTime = 0;

        this.view.toggleThrobber();
        if (this.data.isVideo) {
            this.view.ctrlPlay.html(this.view.symbolPause).addClass('pause');
            this.view.updateRecordingEndTime(false);
        }

        if (this.noTimeUpdateWorkaround) {
            this.noTimeoutInterval = setInterval(function () {
                this.view.updateProgress(this.data.isVideo ? this.data.startTime + currentTime++ : undefined);
            }.bind(this), 1000);
        }
    }.bind(this), true);
};

/**
 * retrieve stream url
 * @param {Array} [streamdevParams]
 * @param {String} [type]
 * @returns {String}
 */
Gui.Video.Controller.Player.prototype.getStreamUrl = function (streamdevParams, type) {

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
    if (this.data.isVideo && this.data.startTime > 0) {
        src += '?pos=time.' + this.data.startTime;
    }
    src += (src.indexOf('?') > -1 ? '&' : '?') + 'd=' + d.getTime() + d.getMilliseconds();

    return src;
};

/**
 * pause playback
 */
Gui.Video.Controller.Player.prototype.pausePlayback = function () {

    this.view.stopHideControls();

    if (this.data.isVideo) {

        this.data.startTime = Math.floor(this.data.startTime + this.video.getCurrentTime());
        this.view.updateRecordingEndTime(true);
    }

    if (!this.settingParams) {
        this.video.setPoster();
    }
    this.isPlaying = false;
    this.video.pause();

    this.view.ctrlPlay.html(this.view.symbolPlay).removeClass('pause');

    if (this.noTimeUpdateWorkaround) {
        clearInterval(this.noTimeoutInterval);
    }
};

/**
 * stop playback
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.prototype.stopPlayback = function (e) {

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
Gui.Video.Controller.Player.prototype.changeSrc = function (e) {

    var channels, getter, nextChannel,
        callback = function () {

            this.view.updateRecordingEndTime(false);

            this.data.isVideo && this.module.getHelper('Player').setVideoPoster(this.getPosterOptions(2));
            this.removeOsdObserver();
            this.view.initOsd();
            this.addOsdObserver();
        }.bind(this);

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

    if (e instanceof jQuery.Event) {

        this.vibrate();

        channels = VDRest.app.getModule('VDRest.Epg').getModel('Channels');
        getter = $(e.target).hasClass('channel-up') ? 'Next' : 'Previous';
        nextChannel = channels['get' + getter + 'Channel'](this.data.sourceModel);
        if (nextChannel) {
            if (!this.oldChannelId) {
                this.oldChannelId = this.data.sourceModel.getData('channel_id');
            }
            this.data.sourceModel = nextChannel;
        } else {
            return;
        }
    } else {
        this.data.sourceModel = e;
        if (this.isPlaying) {
            this.pausePlayback();
        }
        this.video.setDefaultPoster();
    }

    if (this.data.sourceModel instanceof VDRest.Epg.Model.Channels.Channel) {
        this.data.sourceModel.getCurrentBroadcast(function (broadcast) {
            if (broadcast) {
                this.view.setData('current_broadcast', broadcast);
                this.setIsTv();
                this.removeDownloadEvent();
                this.view.removeDownloadButton();
                this.view.addChannelButtons();
                this.removeZappObserver();
                this.addZappObserver();
                this.data.startTime = parseInt(Date.now() / 1000, 10) - broadcast.getData('start_time');
                this.view.setData('startTime', this.data.startTime);
                callback();
            }
        }.bind(this));
    } else if (this.data.sourceModel instanceof VDRest.Recordings.Model.List.Recording) {

        this.setIsVideo();
        this.data.startTime = 0;
        this.view.setData('startTime', this.data.startTime);
        this.removeZappObserver();
        this.view.removeChannelButtons();
        this.view.addDownloadButton();
        this.addDownloadEvent();

        this.video.addPlayObserver(this.view.updateRecordingStartEndTime.bind(this.view), true);
        callback();
    }
};

/**
 * start set cut markers
 */
Gui.Video.Controller.Player.prototype.startCutting = function () {

    $window.one('gui-recording.updated.' + this.data.sourceModel.keyInCache.toCacheKey(), function () {


        this.cutter = this.module.getController('Cutter', {
            "sourceModel": this.data.sourceModel,
            "parent": this
        }).dispatchView();


        //console.log('VP: ', this.data.sourceModel);
        //
        //console.log(this.video.getCurrentTime());
        //
        //this.data.sourceModel.data.marks = [
        //
        //    '00:40:02.03',
        //    '00:01:02.03'
        //];
        //
        //this.data.sourceModel.saveCuttingMarks();
        //
        //setTimeout(function () {
        //
        //    this.data.sourceModel.cut();
        //}.bind(this), 2000);
    }.bind(this));

    this.data.sourceModel.getCuttingMarks();
};

/**
 * indicate that stream is recording
 */
Gui.Video.Controller.Player.prototype.setIsVideo = function () {

    this.data.isTv = false;
    this.data.isVideo = true;
    this.view.data.isTv = this.data.isTv;
    this.view.data.isVideo = this.data.isVideo;
};

/**
 * indicate that stream is live tv
 */
Gui.Video.Controller.Player.prototype.setIsTv = function () {

    this.data.isTv = true;
    this.data.isVideo = false;
    this.view.data.isTv = this.data.isTv;
    this.view.data.isVideo = this.data.isVideo;
};

/**
 * toggle fullscreen
 */
Gui.Video.Controller.Player.prototype.toggleFullScreen = function (e) {

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
Gui.Video.Controller.Player.prototype.requestFullscreen = function () {

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
Gui.Video.Controller.Player.prototype.cancelFullscreen = function () {

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
 * destroy
 */
Gui.Video.Controller.Player.prototype.destructView = function () {

    this.video.destructView();
    delete this.video;
    Gui.Window.Controller.Abstract.prototype.destructView.call(this);
    this.module.cache.invalidateAllTypes(this);
    this.module.unsetVideoPlayer();
    clearInterval(this.noTimeoutInterval);

    VDRest.app.getModule('Gui.Epg').unMute();
};
