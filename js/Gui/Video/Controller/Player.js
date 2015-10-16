/**
 * @typedef {{}} videoPlayerData
 * @property {(VDRest.Epg.Model.Channels.Channel|VDRest.Recordings.Model.List.Recording)} sourceModel
 */

/**
 * @class
 * @constructor
 * @property {Gui.Video.Controller.Player.Controls} controls
 * @property {Gui.Video.View.Player} view
 * @property {Gui.Video.Controller.Player.Video} video
 * @property {videoPlayerData} data
 */
Gui.Video.Controller.Player = function () {
};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Video.Controller.Player.prototype = new Gui.Window.Controller.Abstract();

/**
 * @type {boolean}
 */
Gui.Video.Controller.Player.prototype.bypassCache = true;

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
    this.data.startDate = Date.now();
    this.data.startTime = 0;
    this.data.progress = 0;
    this.spooling = false;
    this.mode = 'Playback';

    if (this.data.sourceModel instanceof VDRest.Epg.Model.Channels.Channel) {
        this.data.isTv = true;
    } else {
        this.data.isVideo = true;
    }

    this.view = this.module.getView('Player', this.data);

    this.view.setParentView({
        "node" : $('body')
    });

    this.video = this.module.getController('Player.Video', {"parent" : this});

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * dispatch view
 */
Gui.Video.Controller.Player.prototype.dispatchView = function () {

    if (this.data.isTv) {

        this.data.sourceModel.getCurrentBroadcast(function (broadcast) {
            this.setData('current_broadcast', broadcast);
            this.data.startTime = parseInt(Date.now() / 1000, 10) - broadcast.getData('start_time');
            this.doDispatch();
        }.bind(this));
    } else {
        this.doDispatch();
    }
};

/**
 * dispatch view
 */
Gui.Video.Controller.Player.prototype.doDispatch = function () {

    VDRest.app.getModule('Gui.Epg').mute();

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);
    this.video.dispatchView();
    this.preventReload()
        .preventReload(this.view.modalOverlay[0])
        .addObserver();
    if (this.data.isVideo) {
        this.fetchPoster(2);
    }
    this.data.isTv && this.startUpdateBroadcastTimer();
    this.dispatchControls();
};

/**
 * dispatch controls
 */
Gui.Video.Controller.Player.prototype.dispatchControls = function () {

    if (!this.controls) {
        this.controls = this.module.getController('Player.Controls', {"parent": this});
        this.controls.dispatchView();
        if (this.controlsInitiallyDispatched) {
            this.controls.deferHide();
        }
    }
    this.controlsInitiallyDispatched = true;
};

/**
 * add event listeners
 */
Gui.Video.Controller.Player.prototype.addObserver = function () {

    this.view.node.on('click', this.dispatchControls.bind(this));

    if (!this.noTimeUpdateWorkaround && this.data.isVideo) {
        this.video.addTimeUpdateObserver(function (e) {
            this.data.progress = parseInt((e.timeStamp - this.data.startDate) / 1000, 10);
        }.bind(this));
    }

    this.video.addStalledObserver(this.handleStalled.bind(this));

    if (this.data.isVideo) {
        this.video.addPlayObserver(function () {
            if (this.controls) {
                this.controls.layer.osd.timeLine.updateRecordingStartEndTime.bind(
                    this.controls.layer.osd.timeLine
                )
            }
        }.bind(this), true);
    }

    this.view.poster.onload = function () {
        this.video.hideThrobber();
        this.view.poster.classList.remove('hidden');
    }.bind(this);

    this.view.poster.onerror = function () {
        this.video.hideThrobber();
        this.view.poster.classList.add('hidden');
    }.bind(this);
};

/**
 * remove event listeners
 */
Gui.Video.Controller.Player.prototype.removeObserver = function () {

    this.view.node.off('click');
    this.view.poster.onload = undefined;
    this.view.poster.onerror = undefined;
};

/**
 * retrieve options object for poster extraction
 * @param {number|{mark: number}} [time]
 * @returns {{
 *      width: number,
 *      height: number,
 *      video: HTMLVideoElement,
 *      sourceModel: VDRest.Recordings.Model.List.Recording|VDRest.Epg.Model.Channels.Channel,
 *      poster: HTMLImageElement,
 *      [startTime]: number,
 *      [mark]: number
 *  }}
 */
Gui.Video.Controller.Player.prototype.getPosterOptions = function (time) {

    var size = VDRest.config.getItem('videoQualitySize'),
        options = {
            "width" : Gui.Video.View.Player.Controls.Quality.Size.prototype.values[size].width,
            "height" : Gui.Video.View.Player.Controls.Quality.Size.prototype.values[size].height,
            "video" : this.video.view.node[0],
            "sourceModel" : this.data.sourceModel,
            "poster" : this.view.poster
        };

    time = time || this.getData('startTime');

    if (time instanceof Object && "undefined" !== typeof time.mark) {
        options.mark = time.mark;
    } else {
        options.startTime = time
    }

    return options;
};

/**
 * fetch video poster
 * @param time
 */
Gui.Video.Controller.Player.prototype.fetchPoster = function (time) {

    if ("undefined" !== typeof this.fetchPosterTimeout) {
        clearTimeout(this.fetchPosterTimeout);
    }
    this.fetchPosterTimeout = setTimeout(function () {
        this.video.showThrobber();
        this.module.getHelper('Player')
            .setVideoPoster(this.getPosterOptions(time));
    }.bind(this), 400);
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

    if (this.controls.isHidden) {
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

    this.video.toggleThrobber();
    this.addTimeUpdateObserver(function () {
        this.video.toggleThrobber();
    }.bind(this), true);
};

/**
 * toggle minimize
 */
Gui.Video.Controller.Player.prototype.toggleMinimize = function (e) {

    if (this.controls.isHidden && !this.data.isMinimized) {
        return;
    }

    if (e instanceof jQuery.Event) {
        e.stopPropagation();
    }

    this.vibrate();

    if (!this.data.isMinimized) {
        this.cancelFullscreen();
        this.historyState = history.state;
        VDRest.app.setNoHistoryActionFlag();
        history.back();
        document.body.classList.add('video-minimized');
        setTimeout(function () {
            this.view.node.one('click', function () {
                this.toggleMinimize();
            }.bind(this));
        }.bind(this), 2000);
        VDRest.app.getModule('Gui.Window').popRegister();
        this.data.isMinimized = true;
        VDRest.app.getModule('Gui.Epg').unMute();
    } else {
        VDRest.app.getModule('Gui.Epg').mute();
        history.pushState(this.historyState, document.title, location.pathname);
        document.body.classList.remove('video-minimized');
        this.data.isMinimized = false;
        VDRest.app.getModule('Gui.Window').register(this);
    }
};

/**
 * start timer to update tv osd
 */
Gui.Video.Controller.Player.prototype.startUpdateBroadcastTimer = function () {

    var broadcast = this.getData('current_broadcast'),
        end = (broadcast.getData('end_time') - parseInt(Date.now() / 1000, 10)) * 1000;

    this.data.progress = VDRest.helper.getDurationAsString(
        parseInt(Date.now() / 1000, 10) - broadcast.getData('start_time'), true
    );

    this.updateBroadcastTimeout = setTimeout(function () {

        this.data.sourceModel.getCurrentBroadcast(function (broadcast) {
            if (broadcast) {
                this.setData('current_broadcast', broadcast);
                if (this.controls) {
                    this.controls.layer.osd.update();
                    this.controls.layer.osd.timeLine.update();
                }
                this.startUpdateBroadcastTimer();
            }
        }.bind(this));

    }.bind(this), end);
};

/**
 * toggle playback
 */
Gui.Video.Controller.Player.prototype.togglePlayback = function (e) {

    this.vibrate();

    e.stopPropagation();

    if (this.isPlaying) {
        if (this.oldChannelId && this.oldChannelId !== this.data.sourceModel.getData('channel_id')) {
            this.oldChannelId = undefined;
            this.pausePlayback();
        }
    }

    if (this.isPlaying) {

        this.pausePlayback();
    } else {

        this.startPlayback();
    }
};

/**
 * start playback
 */
Gui.Video.Controller.Player.prototype.startPlayback = function () {

    this.isPlaying = true;
    this.video.toggleThrobber();
    this.view.poster.classList.add('hidden');

    this.video.play(this.getStreamUrl());

    this.video.addPlayObserver(function () {

        this.video.toggleThrobber();
        if (this.data.isVideo && this.controls) {
            this.controls.layer.osd.timeLine.updateRecordingEndTime(false);
        }

        if (this.noTimeUpdateWorkaround && this.data.isVideo) {
            this.noTimeoutInterval = setInterval(function () {
                this.data.progress++;
                if (this.controls) {
                    this.controls.layer.osd.timeLine.updateProgress(this.data.progress);
                }
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

    var size = VDRest.config.getItem('videoQualitySize'),
        bitrate = VDRest.config.getItem('videoQualityBitrate'),
        duration, src, d = new Date();

    streamdevParams = streamdevParams || [];

    type = type || VDRest.config.getItem('streamdevContainer');

    streamdevParams.push('TYPE=' + type);
    streamdevParams.push('WIDTH=' + Gui.Video.View.Player.Controls.Quality.Size.prototype.values[size].width);
    streamdevParams.push('HEIGHT=' + Gui.Video.View.Player.Controls.Quality.Size.prototype.values[size].height);
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

    if (this.controls) {
        this.controls.stopHide();
    }

    if (this.data.isVideo) {

        if (!this.noTimeUpdateWorkaround) {
            this.data.progress += Math.floor(this.video.getCurrentTime());
        }
        this.data.startTime += this.data.progress;
        if (this.noTimeUpdateWorkaround) {
            this.data.progress = 0;
        }
        if (this.controls) {
            this.controls.layer.osd.timeLine.updateRecordingEndTime(true);
        }
    }
    this.isPlaying = false;
    this.video.pause();

    if (this.data.isVideo) {
        this.fetchPoster();
    }

    if (this.noTimeUpdateWorkaround) {
        clearInterval(this.noTimeoutInterval);
    }
};

/**
 * stop playback
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.prototype.stopPlayback = function (e) {

    if (this.controls.isHidden) {
        return;
    }

    this.vibrate();

    e.stopPropagation();

    history.back();
};

/**
 * change video source
 * @param {VDRest.Epg.Model.Channels.Channel|VDRest.Recordings.Model.List.Recording|jQuery.Event} e
 */
Gui.Video.Controller.Player.prototype.changeSrc = function (e) {

    var channels, getter, nextChannel,
        callback = function () {
            var newTriggerPlayState = 'off';

            if (this.controls) {
                this.controls.destructView(false);
            }
            this.dispatchControls();
            this.controls.layer.osd.update();
            if (this.data.isTv) {
                if (this.data.sourceModel.getData('channel_id') == this.oldChannelId && this.isPlaying) {
                    newTriggerPlayState = 'on';
                }
                if (this.controls) {
                    this.controls.layer.triggerPlay.view.setState(newTriggerPlayState);
                }
            } else {
                if (this.controls) {
                    this.controls.layer.osd.timeLine.updateRecordingEndTime(false);
                }
                this.fetchPoster(2);
            }
        }.bind(this);

    if (e instanceof jQuery.Event) {
        e.preventDefault();
        e.stopPropagation();
        if (this.controls) {
            this.controls.stopHide();
        }
    }

    if (this.data.sourceModel == e) {
        return;
    }

    if ("undefined" !== typeof this.updateBroadcastTimeout) {
        clearTimeout(this.updateBroadcastTimeout);
        this.updateBroadcastTimeout = undefined;
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
                this.setData('current_broadcast', broadcast);
                this.setIsTv();
                this.data.startTime = parseInt(Date.now() / 1000, 10) - broadcast.getData('start_time');
                this.view.setData('startTime', this.data.startTime);
                callback();
            }
        }.bind(this));
    } else if (this.data.sourceModel instanceof VDRest.Recordings.Model.List.Recording) {

        this.setIsVideo();
        this.data.startTime = 0;
        this.view.setData('startTime', this.data.startTime);

        this.video.addPlayObserver(function () {
            if (this.controls) {
                this.controls.layer.osd.timeLine.updateRecordingStartEndTime.bind(
                    this.controls.layer.osd.timeLine
                )
            }
        }.bind(this), true);
        callback();
    }
};

/**
 * start set cut markers
 */
Gui.Video.Controller.Player.prototype.startCutting = function () {

    var eventKey = this.data.sourceModel.keyInCache.toCacheKey();

    $window.one('vdrest-api-actions.load-recording-marks-failed' + eventKey, function () {
        $window.off('gui-recording.updated.' + eventKey);
        this.video.hideThrobber();
    }.bind(this));

    $window.one('gui-recording.updated.' + eventKey, function () {

        $window.off('vdrest-api-actions.load-recording-marks-failed' + eventKey);
        if (this.controls) {
            this.controls.destructView();
            delete this.controls;
            this.mode = 'cut';
            this.dispatchControls();
            this.controls.stopHide();
            this.video.hideThrobber();
        }
    }.bind(this));

    if (!this.cutRequest) {
        this.video.showThrobber();
        this.cutRequest = true;
        this.data.sourceModel.getCuttingMarks();
    }
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

    if (this.controls.isHidden) {
        return;
    }

    e.stopPropagation();

    this.vibrate();

    this[this.isFullScreen() ? 'cancelFullscreen' : 'requestFullscreen']();
};

/**
 * detect player is full screen
 * @return {boolean}
 */
Gui.Video.Controller.Player.prototype.isFullScreen = function () {

    if ("undefined" != typeof document['fullScreen']) {
        return document['fullScreen'];
    }

    if ("undefined" != typeof document['mozFullscreen']) {
        return document['mozFullscreen'];
    }

    if ("undefined" != typeof document['webkitIsFullScreen']) {
        return document['webkitIsFullScreen'];
    }
};

/**
 * hides status bar and dims buttons
 * use video tag if one day all the bugs are fixed
 * (no custom controls possible, garbled playback for some time after change)
 */
Gui.Video.Controller.Player.prototype.requestFullscreen = function () {

    if ((document['fullScreenElement'] && document['fullScreenElement'] !== null) ||
        (!document['mozFullScreen'] && !document['webkitIsFullScreen'])) {
        if (document.documentElement['requestFullScreen']) {
            document.documentElement['requestFullScreen']();
        } else if (document.documentElement['mozRequestFullScreen']) {
            document.documentElement['mozRequestFullScreen']();
        } else if (document.documentElement['webkitRequestFullScreen']) {
            document.documentElement['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']);
        }
    }
};

/**
 * leave fullscreen
 */
Gui.Video.Controller.Player.prototype.cancelFullscreen = function () {

    if (document['cancelFullScreen']) {
        document['cancelFullScreen']();
    } else if (document['mozCancelFullScreen']) {
        document['mozCancelFullScreen']();
    } else if (document['webkitCancelFullScreen']) {
        document['webkitCancelFullScreen']();
    }
};

/**
 * destroy
 */
Gui.Video.Controller.Player.prototype.destructView = function () {

    if ("undefined" !== this.noTimeoutInterval) {
        clearInterval(this.noTimeoutInterval);
    }
    if (this.controls) {
        this.controls.omitDestruct = false;
        this.controls.destructView(false);
    }
    this.video.destructView();
    delete this.video;
    this.module.unsetVideoPlayer();
    VDRest.app.getModule('Gui.Epg').unMute();
    Gui.Window.Controller.Abstract.prototype.destructView.call(this);
};
