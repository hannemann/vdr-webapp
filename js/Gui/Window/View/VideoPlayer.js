/**
 * @class
 * @constructor
 */
Gui.Window.View.VideoPlayer = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.VideoPlayer.prototype = new Gui.Window.View.Abstract();

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.VideoPlayer.prototype.isModal = true;

/**
 * @type {boolean}
 */
Gui.Window.View.VideoPlayer.prototype.isModalOpaque = true;

/**
 * @type {boolean}
 */
Gui.Window.View.VideoPlayer.prototype.modalExtraClasses = "modal-video";

/**
 * @type {string}
 */
Gui.Window.View.VideoPlayer.prototype.cacheKey = 'url';

/**
 * @type {string}
 */
Gui.Window.View.VideoPlayer.prototype.symbolPlay = 'C';

/**
 * @type {string}
 */
Gui.Window.View.VideoPlayer.prototype.symbolPause = 'B';

/**
 * @type {string}
 */
Gui.Window.View.VideoPlayer.prototype.symbolStop = 'D';

/**
 * @type {string}
 */
Gui.Window.View.VideoPlayer.prototype.symbolNext = 'S';

/**
 * @type {string}
 */
Gui.Window.View.VideoPlayer.prototype.symbolPrevious = 'T';

/**
 * @type {string}
 */
Gui.Window.View.VideoPlayer.prototype.symbolFullscreen = 'Q';

/**
 * @type {string}
 */
Gui.Window.View.VideoPlayer.prototype.symbolExitFullscreen = 'R';

/**
 * @type {string}
 */
Gui.Window.View.VideoPlayer.prototype.symbolQuality = 'A';

/**
 * @type {string}
 */
Gui.Window.View.VideoPlayer.prototype.symbolMinimize = 'O';

/**
 * @type {string}
 */
Gui.Window.View.VideoPlayer.prototype.symbolMaximize = 'P';

/**
 * @type {string}
 */
Gui.Window.View.VideoPlayer.prototype.symbolDownload = 'X';

/**
 * @type {string}
 */
Gui.Window.View.VideoPlayer.prototype.sizes = {
    "HD1080" : {
        "width" : 1920,
        "height" : 1080
    },
    "HD720" : {
        "width" : 1280,
        "height" : 720
    },
    "SD" : {
        "width" : 1024,
        "height" : 576
    },
    "768x432" : {
        "width" : 768,
        "height" : 432
    },
    "640x360" : {
        "width" : 640,
        "height" : 360
    },
    "480x270" : {
        "width" : 480,
        "height" : 270
    },
    "320x180" : {
        "width" : 320,
        "height" : 180
    }
};

/**
 * @type {string[]}
 */
Gui.Window.View.VideoPlayer.prototype.bitrates = [
    '2048K', '1536K', '1024K', '768K', '512K', '256K', '128K', '96K', '64K'
];

/**
 * initialize video node
 */
Gui.Window.View.VideoPlayer.prototype.init = function () {

    this.node = $('<div class="video-player-wrapper">');
    this.player = $('<video preload="none" class="normal-size">');
    this.video = this.player.get(0);
    this.controls = $('<div class="html5-player-controls show">');
    this.controls.attr('data-animate', 'opacity');
    this.defaultTitle = $('title').text();

    if (location.host != VDRest.config.getItem('host')) {
        this.player.prop('crossOrigin', 'anonymous');
    }

    $('body').addClass('has-video-player');
};

/**
 * decorate and render
 */
Gui.Window.View.VideoPlayer.prototype.render = function () {

    this.initPlayer();

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.addClasses();

    this.node.toggleClass('collapsed expand');
    this.setDefaultPoster();

    this.sizeList.css({
        "top": - this.sizeList.find('.item.selected').position().top + 'px'
    });
    this.bitrateList.css({
        "top": - this.bitrateList.find('.item.selected').position().top + 'px'
    });
};

/**
 * initialize player
 * @returns {Gui.Window.View.VideoPlayer}
 */
Gui.Window.View.VideoPlayer.prototype.initPlayer = function () {

    this.player.appendTo(this.node);
    this.initControls().initOsd();

    return this;
};

/**
 * set poster with icon
 */
Gui.Window.View.VideoPlayer.prototype.setDefaultPoster = function () {

    this.player.attr(
        'poster',
        this.module.getHelper('VideoPlayer').defaultPoster(this.video)
    );
};

/**
 * add control elements
 */
Gui.Window.View.VideoPlayer.prototype.initControls = function () {

    this.controls.appendTo(this.node);
    this.addControlButtons()
        .addThrobber()
        .addVolumeControl()
        .setInitialVolume()
        .setVolumeSliderHeight()
        .addQualitySelector();

    return this;
};

/**
 * initialize osd
 * @returns {Gui.Window.View.VideoPlayer}
 */
Gui.Window.View.VideoPlayer.prototype.initOsd = function () {

    if ("undefined" !== typeof this.osd) {
        this.osd.remove();
    }

    this.osd = $('<div class="video-osd">').appendTo(this.controls);
    this.addTitle()
        .addTimeLine()
        .addProgress()
        .updateProgress()
        .scrollTitle();

    return this;
};

/**
 * add control buttons to overlay
 */
Gui.Window.View.VideoPlayer.prototype.addControlButtons = function () {

    this.ctrlPlay = $(
        '<div class="vdr-web-symbol play">' + this.symbolPlay + '</div>'
    ).appendTo(this.controls);

    this.ctrlStop = $(
        '<div class="vdr-web-symbol stop">' + this.symbolStop + '</div>'
    ).appendTo(this.controls);

    this.ctrlFullScreen = $(
        '<div class="vdr-web-symbol toggle-fullScreen">' + this.symbolFullscreen + '</div>'
    ).appendTo(this.controls);

    this.ctrlQuality = $(
        '<div class="vdr-web-symbol toggle-quality">' + this.symbolQuality + '</div>'
    ).appendTo(this.controls);

    this.ctrlMinimize = $(
        '<div class="vdr-web-symbol minimize">' + this.symbolMinimize + '</div>'
    ).appendTo(this.controls);

    this.addDownloadButton();
    this.addChannelButtons();

    return this;
};

/**
 * add download button
 */
Gui.Window.View.VideoPlayer.prototype.addDownloadButton = function () {

    if (VDRest.config.getItem('streamDownload') && this.data.isVideo) {
        this.ctrlDownload = $(
            '<div class="vdr-web-symbol download">' + this.symbolDownload + '</div>'
        ).appendTo(this.controls);
    }
};

/**
 * add download button
 */
Gui.Window.View.VideoPlayer.prototype.removeDownloadButton = function () {

    if ("undefined" !== typeof this.ctrlDownload) {
        this.ctrlDownload.remove();
        this.ctrlDownload = undefined;
    }
};

/**
 * add timeline
 * @returns {Gui.Window.View.VideoPlayer}
 */
Gui.Window.View.VideoPlayer.prototype.addTimeLine = function () {

    this.ctrlTimeline = $('<div class="slider timeline">').appendTo(this.osd);
    this.timelineSlider = $('<div>').appendTo(this.ctrlTimeline);

    return this;
};

/**
 * add channel buttons
 */
Gui.Window.View.VideoPlayer.prototype.addChannelButtons = function () {

    if (this.data.isTv && !this.ctrlChannelUp) {
        this.ctrlChannelUp = $(
            '<div class="vdr-web-symbol channel-up">' + this.symbolNext + '</div>'
        ).appendTo(this.controls);
        this.ctrlChannelDown = $(
            '<div class="vdr-web-symbol channel-down">' + this.symbolPrevious + '</div>'
        ).appendTo(this.controls);
    }
};

/**
 * remove channel buttons
 */
Gui.Window.View.VideoPlayer.prototype.removeChannelButtons = function () {

    if (this.ctrlChannelUp) {
        this.ctrlChannelUp.remove();
        this.ctrlChannelDown.remove();
        this.ctrlChannelUp = undefined;
        this.ctrlChannelDown = undefined;
    }
};

/**
 * toggle minimized class
 */
Gui.Window.View.VideoPlayer.prototype.toggleMinimize = function () {

    var body = $('body'), className = 'video-minimized';

    body.toggleClass(className);

    if (body.hasClass(className)) {
        this.ctrlMinimize.html(this.symbolMaximize);
    } else {
        this.ctrlMinimize.html(this.symbolMinimize);
    }
};

/**
 * add volume slider and indicator
 * @returns {Gui.Window.View.VideoPlayer}
 */
Gui.Window.View.VideoPlayer.prototype.addVolumeControl = function () {

    this.volumeWrapper = $('<div class="volume-wrapper">').appendTo(this.controls);
    this.ctrlVolume = $('<div class="slider volume">').appendTo(this.volumeWrapper);
    this.volumeSlider = $('<div>').appendTo(this.ctrlVolume);
    this.volumeIndicator = $('<div class="vdr-web-symbol info volume-indicator">');
    this.volumeIndicator.attr('data-animate', 'opacity fast');
    this.volumeIndicator.appendTo(this.controls);
    this.volumeIndicatorLabel = $('<span class="label">').appendTo(
        this.volumeIndicator
    );
    this.volumeIndicatorValue = $('<span class="value">').appendTo(
        this.volumeIndicator
    );

    return this;
};

/**
 * set initial volume
 */
Gui.Window.View.VideoPlayer.prototype.setInitialVolume = function () {

    var volume = VDRest.config.getItem('html5VideoPlayerVol') || 1;
    this.video.volume = parseFloat(volume);
    this.updateVolumeIndicator(this.getVolumePercentage());

    return this;
};

/**
 * toggle active state of volume slider
 */
Gui.Window.View.VideoPlayer.prototype.toggleVolumeSliderActiveState = function () {

    this.ctrlVolume.toggleClass('active');
};

/**
 * set height of volume slider
 */
Gui.Window.View.VideoPlayer.prototype.setVolumeSliderHeight = function () {

    var percentage = this.getVolumeSliderHeight();

    this.volumeSlider.css({
        "top" : percentage
    });
    this.updateVolumeIndicator();

    return this;
};

/**
 * Update volume indicator
 */
Gui.Window.View.VideoPlayer.prototype.updateVolumeIndicator = function () {

    var symbol, value = this.getVolumePercentage();

    if (value == 0) {
        symbol = 'U';
    } else if (value <= 50) {
        symbol = 'V';
    } else {
        symbol = 'W';
    }

    this.volumeIndicatorLabel.text(symbol);
    this.volumeIndicatorValue.text(value.toString() + '%');
};

/**
 * toggle volume indicator visibility
 * @param {Boolean} show
 */
Gui.Window.View.VideoPlayer.prototype.toggleVolumeIndicator = function (show) {

    show = !!show;
    this.volumeIndicator.toggleClass('show', show);
};

/**
 * retrieve css top property for volumeslider
 * @returns {string}
 */
Gui.Window.View.VideoPlayer.prototype.getVolumeSliderHeight = function () {

    var height = 100 - this.getVolumePercentage();

    return height <= 0 ? '1px' : height.toString() + '%';
};

/**
 * retrieve percentage volume
 * @returns {int}
 */
Gui.Window.View.VideoPlayer.prototype.getVolumePercentage = function () {

    return parseInt(this.player.get(0).volume * 100, 10);
};

/**
 * show controls overlay
 */
Gui.Window.View.VideoPlayer.prototype.toggleControls = function (e) {

    if (this.omitToggleControls) {
        this.omitToggleControls = undefined;
        return;
    }

    if (e instanceof jQuery.Event) {
        e.stopPropagation();
    }
    this.stopHideControls();

    if (this.controls.hasClass('show')) {
        this.controls.removeClass('show');
        this.qualitySelect.removeClass('show');
    } else {

        this.controls.addClass('show');
        this.scrollTitle();
        if (!e) {
            this.deferHideControls();
        }
    }
};

/**
 * defer hiding controls
 */
Gui.Window.View.VideoPlayer.prototype.deferHideControls = function () {

    var me = this;

    this.controlsTimeout = setTimeout(function () {
        me.controls.removeClass('show');
        me.qualitySelect.removeClass('show');
    }, 5000);
};

/**
 * stop hiding controls
 */
Gui.Window.View.VideoPlayer.prototype.stopHideControls = function () {

    if ("undefined" !== typeof this.controlsTimeout) {
        clearTimeout(this.controlsTimeout);
        this.controlsTimeout = undefined;
    }
};

/**
 * add throbber
 */
Gui.Window.View.VideoPlayer.prototype.addThrobber = function () {

    this.throbber = $(
        '<div style="background-image: url('
        + VDRest.image.getThrobber()
        + ')" class="throbber">'
    );
    this.throbber.appendTo(this.node);

    return this;
};

/**
 * toggle throbber
 */
Gui.Window.View.VideoPlayer.prototype.toggleThrobber = function () {

    this.throbber.toggleClass('show');
};

/**
 * show quality overlay
 * @param {Boolean} [force]
 */
Gui.Window.View.VideoPlayer.prototype.toggleQuality = function (force) {

    this.stopHideControls();
    this.qualitySelect.toggleClass('show', force);
};

/**
 * set width of timeline slider
 */
Gui.Window.View.VideoPlayer.prototype.setTimelineSliderWidth = function () {

    this.timelineSlider.css({
        "right" : this.getTimelinePercentage()
    });

    return this;
};

/**
 * toggle timeline active state
 */
Gui.Window.View.VideoPlayer.prototype.toggleTimeLineActiveState = function () {

    this.ctrlTimeline.toggleClass('active');
};

/**
 * retrieve css left property fpr timelineSlider
 * @returns {string}
 */
Gui.Window.View.VideoPlayer.prototype.getTimelinePercentage = function () {

    var percentage, now, broadcast;

    if (this.data.isVideo) {
        percentage = 100 - (
            100 * (
                this.getData('startTime') + this.video.currentTime
            ) / this.data.sourceModel.getData('duration')
        );
    } else if (this.data.isTv) {

        now = parseInt(new Date().getTime() / 1000, 10);
        broadcast = this.getData('current_broadcast');
        if (broadcast) {
            percentage = 100 - (
                100 * (
                now - broadcast.getData('start_time')
                ) / broadcast.getData('duration')
            );
        } else {
            percentage = 100;
        }
    }

    return percentage <= 0 ? '1px' : percentage.toString() + '%';
};

/**
 * add timer
 */
Gui.Window.View.VideoPlayer.prototype.addProgress = function () {

    var start, end, duration, helper = this.helper(), broadcast;

    if ("undefined" != typeof this.progress) {
        this.progress.remove();
        delete this.progress;
    }

    this.progress = $('<div class="progress info"></div>');
    this.start = $('<div class="progress-start info">').appendTo(this.progress);
    this.currentProgress = $('<div class="progress-current info">')
        .text(this.data.progress)
        .appendTo(this.progress);
    this.duration = $('<div class="progress-duration info">')
        .appendTo(this.progress);
    this.end = $('<div class="progress-end info">').appendTo(this.progress);

    if (this.data.isVideo) {

        start = helper.getTimeString(new Date());
        duration = this.data.sourceModel.getData('duration');
        end = helper.getTimeString(
            new Date(new Date().getTime() + duration * 1000)
        );
        duration = helper.getDurationAsString(duration, true);
    } else {
        broadcast = this.getData('current_broadcast');
        start = helper.getTimeString(broadcast.getData('start_date'));
        end = helper.getTimeString(broadcast.getData('end_date'));
        duration = helper.getDurationAsString(broadcast.getData('duration'), true);
    }
    this.start.text(start);
    this.end.text(end);
    this.duration.html('&nbsp;/&nbsp;' + duration);

    this.progress.appendTo(this.osd);
    return this;
};

/**
 * update recording end time periodically in case of recording is paused
 * @param {Boolean} action
 */
Gui.Window.View.VideoPlayer.prototype.updateRecordingEndTime = function (action) {

    var me = this,
        duration = this.data.sourceModel.getData('duration'),
        helper = this.helper();

    if (action) {
        this.endTimeInterval = setInterval(function () {

            me.end.text(helper.getTimeString(
                new Date(new Date().getTime()
                    + duration * 1000
                    - me.getData('startTime') * 1000
                )
            ));
        }, 1000);
    } else {
        clearInterval(this.endTimeInterval);
    }
};

/**
 * update start and end time
 */
Gui.Window.View.VideoPlayer.prototype.updateRecordingStartEndTime = function () {

    var duration = this.data.sourceModel.getData('duration'),
        helper = this.helper(), start, end, d = new Date();


    start = helper.getTimeString(d);
    end = helper.getTimeString(new Date(d.getTime() + duration * 1000 - this.data.startTime * 1000));

    this.end.text(end);
    this.start.text(start);
};

/**
 * @param {Number} [time]
 * update timer
 */
Gui.Window.View.VideoPlayer.prototype.updateProgress = function (time) {

    var now, broadcast;

    if (isNaN(time)) {
        if (this.data.isVideo) {
            time = this.getData('startTime') + this.video.currentTime;
        } else {
            now = parseInt(new Date().getTime() / 1000, 10);
            broadcast = this.getData('current_broadcast');
            if (broadcast) {
                time = now - broadcast.getData('start_time');
            } else {
                time = 0;
            }
        }
    }

    this.currentProgress.text(this.helper().getDurationAsString(time, true));
    this.setTimelineSliderWidth();
    return this;
};

/**
 * add quality selector
 */
Gui.Window.View.VideoPlayer.prototype.addQualitySelector = function () {

    var i, l = this.bitrates.length, item;

    this.qualitySelect = $('<div class="quality-select">');
    this.qualitySelect.attr('data-animate', 'opacity');
    this.sizeSelect = $('<div class="select size-select">').appendTo(this.qualitySelect);
    this.bitrateSelect = $('<div class="select bitrate-select">').appendTo(this.qualitySelect);

    this.sizeList = $('<div class="item-list sizes">').appendTo(this.sizeSelect);
    for (i in this.sizes) {
        if (this.sizes.hasOwnProperty(i)) {
            item = '<div class="item size' +
            (i == VDRest.config.getItem('videoQualitySize') ? ' selected' : '')
            + '">';
            $(item).text(i).appendTo(this.sizeList);
        }
    }

    this.bitrateList = $('<div class="item-list bitrates">').appendTo(this.bitrateSelect);
    for (i=0; i<l; i++) {
        item = '<div class="item bitrate' +
        (this.bitrates[i] == VDRest.config.getItem('videoQualityBitrate') ? ' selected' : '')
        + '">';
        $(item).text(this.bitrates[i]).appendTo(this.bitrateList);
    }

    this.qualitySelect.appendTo(this.controls);

    return this;
};

Gui.Window.View.VideoPlayer.prototype.toggleQualityControlActiveState = function (selector) {

    selector.toggleClass('active');
};

/**
 * add title and subtitle to player
 */
Gui.Window.View.VideoPlayer.prototype.addTitle = function () {

    var now,
        me = this, end, logo,
        sourceModel = this.data.sourceModel;

    if (this.infoArea) {
        this.infoArea.remove();
    }

    this.infoArea = $('<div class="info-area info">');
    this.title = $('<div class="title info">').appendTo(this.infoArea);

    if (this.data.isVideo) {
        this.title.text(sourceModel.getData('event_title'));
        if ('' !== sourceModel.getData('event_short_text')) {
            this.subTitle = $('<div class="short-text info">').appendTo(this.infoArea);
            this.subTitle.text(sourceModel.getData('event_short_text'));
        }
    } else {

        if ("undefined" != typeof this.changeTitleTimeout) {
            clearTimeout(this.changeTitleTimeout);
        }

        sourceModel.getCurrentBroadcast(function (broadcast) {
            if (broadcast) {
                this.setData('current_broadcast', broadcast);
                this.title.text(broadcast.getData('title'));
                if ('' !== broadcast.getData('short_text')) {
                    this.subTitle = $('<div class="short-text info">').appendTo(this.infoArea);
                    this.subTitle.text(broadcast.getData('short_text'));
                }

                now = new Date().getTime() / 1000;
                end = (broadcast.getData('end_time') - parseInt(now, 10)) * 1000;

                this.changeTitleTimeout = setTimeout(function () {
                    me.addTitle();
                }, end);
            }

            logo = this.data.sourceModel.getData('image');
            if (logo) {
                this.infoArea.addClass('has-logo');
                this.infoArea.css({
                    "background-image": "url(" + logo + ")"
                });
            }
        }.bind(this));
    }

    this.osd.prepend(this.infoArea);

    $('title').text(this.title.text() + (this.subTitle ? ' - ' + this.subTitle.text() : ''));

    return this;
};

/**
 * scroll title
 */
Gui.Window.View.VideoPlayer.prototype.scrollTitle = function () {

    if ("undefined" !== typeof this.infoAreaScrollInterval) {
        clearInterval(this.infoAreaScrollInterval);
        this.infoAreaScrollInterval = undefined;
    }
    if ("undefined" !== typeof this.infoAreaScrollTimeout) {
        clearTimeout(this.infoAreaScrollTimeout);
        this.infoAreaScrollTimeout = undefined;
    }
    if (this.controls.hasClass('show')) {
        this.animateInfoArea();
    }

};

/**
 * animate info area
 */
Gui.Window.View.VideoPlayer.prototype.animateInfoArea = function () {

    var me = this,
        indent = 0,
        elem = this.infoArea,
        infoWidth = this.infoArea.width(),
        titleWidth,
        subTitleWidth = 0,
        delta;

    elem.css({
        "text-indent": indent
    });

    titleWidth = this.title.width();
    if (this.subTitle) {
        subTitleWidth = this.subTitle.width();
    }

    delta = Math.max(titleWidth, subTitleWidth) - infoWidth;

    if (delta < 1) return;

    this.infoAreaScrollTimeout = setTimeout(function () {

        me.infoAreaScrollInterval = setInterval(function () {
            indent -= 1;

            if (Math.abs(indent) > delta) {
                clearInterval(me.infoAreaScrollInterval);
                me.infoAreaScrollInterval = undefined;
                me.infoAreaScrollTimeout = setTimeout(function () {
                    var skip = 0;
                    elem.find('.info').animate({
                        'opacity' : 0
                    }, {
                        "duration" : "fast",
                        "complete" : function () {
                            elem.css({
                                "text-indent" : 0
                            });
                            elem.find('.info').animate({
                                'opacity' : 1
                            }, {
                                "duration" : "fast",
                                "complete" : function () {
                                    if (skip < 3) {
                                        skip += 1;
                                        return;
                                    }
                                    me.animateInfoArea.call(me);
                                }
                            })
                        }
                    });
                }, 2000);
            } else if (!me.controls.hasClass('show')) {
                clearInterval(me.infoAreaScrollInterval);
                me.infoAreaScrollInterval = undefined;
                elem.css({
                    "text-indent": 0
                });
            } else {
                elem.css({
                    "text-indent": indent + 'px'
                });
            }
        }, 40);
    }, 2000);
};

/**
 * add classes
 * @returns {Gui.Window.View.VideoPlayer}
 */
Gui.Window.View.VideoPlayer.prototype.addClasses = function () {

    var classNames = ['html5-player', 'fullsize', 'collapsed'];

    this.node.addClass(classNames.join(' '));

    return this;
};

/**
 * destroy window
 */
Gui.Window.View.VideoPlayer.prototype.destruct = function () {

    var me = this, player = this.player.get(0);

    if ("undefined" != typeof this.changeTitleTimeout) {
        clearTimeout(this.changeTitleTimeout);
        this.changeTitleTimeout = undefined;
    }

    if ("undefined" !== this.infoAreaScrollInterval) {
        clearInterval(this.infoAreaScrollInterval);
        this.infoAreaScrollInterval = undefined;
    }
    if ("undefined" !== typeof this.infoAreaScrollTimeout) {
        clearTimeout(this.infoAreaScrollTimeout);
        this.infoAreaScrollTimeout = undefined;
    }

    player.pause();
    this.player.prop('src', false);

    Gui.Window.View.Abstract.prototype.destruct.call(me);
    $('body').removeClass('has-video-player');
    $('title').text(this.defaultTitle);
};