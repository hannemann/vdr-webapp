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
    '2048K', '1024K', '512K', '256K', '128K', '96K', '64K'
];

/**
 * initialize video node
 */
Gui.Window.View.VideoPlayer.prototype.init = function () {

    this.node = $('<div class="video-player-wrapper">');
    this.player = $('<video preload="none" class="normal-size">');
    this.video = this.player.get(0);
    this.controls = $('<div class="html5-player-controls show" data-animate="opacity">');
    this.player.prop('crossOrigin', 'anonymous');

    this.initPlayer();

    $('body').addClass('has-video-player');
};

/**
 * decorate and render
 */
Gui.Window.View.VideoPlayer.prototype.render = function () {

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
    this.scrollTitle();
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
    this.addControlButtons().addThrobber().addQualitySelector();

    return this;
};

/**
 * initialize osd
 * @returns {Gui.Window.View.VideoPlayer}
 */
Gui.Window.View.VideoPlayer.prototype.initOsd = function () {

    this.osd = $('<div class="video-osd">').appendTo(this.controls);
    this.addTitle()
        .addTimeLine()
        .addProgress()
        .updateProgress();

    return this;
};

/**
 * add control buttons to overlay
 */
Gui.Window.View.VideoPlayer.prototype.addControlButtons = function () {

    var volume;

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

    this.ctrlVolume = $('<div class="slider volume">').appendTo(this.controls);
    this.volumeSlider = $('<div>').appendTo(this.ctrlVolume);
    this.volumeIndicator = $(
        '<div class="vdr-web-symbol info volume-indicator" data-animate="opacity">'
    ).appendTo(this.controls);

    volume = VDRest.config.getItem('html5VideoPlayerVol') || 1;
    this.video.volume = parseFloat(volume);

    this.setVolumeSliderHeight();
    this.addChannelButtons();

    return this;
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
 * set height of volume slider
 */
Gui.Window.View.VideoPlayer.prototype.setVolumeSliderHeight = function () {

    var percentage = this.getVolumePercentage(), symbol;

    this.volumeSlider.css({
        "top" : percentage
    });
    if (percentage === '1px') {
        percentage = 0;
    }
    percentage = 100 - parseInt(percentage);

    if (percentage == 0) {
        symbol = 'U';
    } else if (percentage <= 50) {
        symbol = 'V';
    } else {
        symbol = 'W';
    }

    this.volumeIndicator.html('<span class="vdr-web-symbol">' + symbol + '</span> ' + percentage.toString() + '%');
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
 * retrieve css top property fpr volumeslider
 * @returns {string}
 */
Gui.Window.View.VideoPlayer.prototype.getVolumePercentage = function () {

    var percentage = 100 - (this.player.get(0).volume * 100);

    return percentage <= 0 ? '1px' : parseInt(percentage).toString() + '%';
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
        '<div style="background: url('
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
 */
Gui.Window.View.VideoPlayer.prototype.toggleQuality = function (e) {

    if (!this.controls.hasClass('show')) return;

    e.stopPropagation();
    e.preventDefault();
    this.stopHideControls();
    this.qualitySelect.toggleClass('show');
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
 * retrieve css left property fpr timelineSlider
 * @returns {string}
 */
Gui.Window.View.VideoPlayer.prototype.getTimelinePercentage = function () {

    var percentage, now, broadcast;

    if (this.data.isVideo) {
        percentage = 100 - (
            100 * (
                this.getData('startTime') + this.video.currentTime
            ) / this.getData('recording').getData('duration')
        );
    } else if (this.data.isTv) {

        now = parseInt(new Date().getTime() / 1000, 10);
        broadcast = this.getData('channel').getCurrentBroadcast();
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

        start = helper.getTimeString(new Date(), true);
        duration = this.getData('recording').getData('duration');
        end = helper.getTimeString(
            new Date(new Date().getTime() + duration * 1000),
            true
        );
        duration = helper.getDurationAsString(duration, true);
    } else {
        broadcast = this.getData('channel').getCurrentBroadcast();
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
        duration = this.getData('recording').getData('duration'),
        helper = this.helper();

    if (action) {
        this.endTimeInterval = setInterval(function () {

            me.end.text(helper.getTimeString(
                new Date(new Date().getTime()
                    + duration * 1000
                    - me.getData('startTime') * 1000
                ),
                true
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

    var duration = this.getData('recording').getData('duration'),
        helper = this.helper(), start, end;


    start = helper.getTimeString(new Date(), true);
    end = helper.getTimeString(
        new Date(new Date().getTime() + duration * 1000),
        true
    );

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
            broadcast = this.getData('channel').getCurrentBroadcast();
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

    this.qualitySelect = $('<div class="quality-select" data-animate="opacity">');
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

/**
 * add title and subtitle to player
 */
Gui.Window.View.VideoPlayer.prototype.addTitle = function () {

    var broadcast, now,
        me = this, end, logo,
        recording = this.getData('recording');

    if (this.infoArea) {
        this.infoArea.remove();
    }

    this.infoArea = $('<div class="info-area info">');
    this.title = $('<div class="title info">').appendTo(this.infoArea);

    if (this.data.isVideo) {
        this.title.text(recording.getData('event_title'));
        if ('' !== recording.getData('event_short_text')) {
            this.subTitle = $('<div class="short-text info">').appendTo(this.infoArea);
            this.subTitle.text(recording.getData('event_short_text'));
        }
    } else {

        if ("undefined" != typeof this.changeTitleTimeout) {
            clearTimeout(this.changeTitleTimeout);
        }

        broadcast = this.data.channel.getCurrentBroadcast();
        if (broadcast) {
            this.title.text(broadcast.getData('title'));
            if ('' !== broadcast.getData('short_text')) {
                this.subTitle = $('<div class="short-text info">').appendTo(this.infoArea);
                this.subTitle.text(broadcast.getData('short_text'));
            }

            now = new Date().getTime()/1000;
            end = (broadcast.getData('end_time') - parseInt(now, 10)) * 1000;

            this.changeTitleTimeout = setTimeout(function () {
                me.addTitle();
            }, end);
        }

        logo = this.data.channel.getData('image');
        if (logo) {
            this.infoArea.addClass('has-logo');
            this.infoArea.css({
                "background-image" : "url(" + logo + ")"
            });
        }
    }

    this.osd.append(this.infoArea);

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
};