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
Gui.Window.View.VideoPlayer.prototype.symbolPlay = '&#9654;';

/**
 * @type {string}
 */
Gui.Window.View.VideoPlayer.prototype.symbolPause = '&#10074;&#10074;';

/**
 * @type {string}
 */
Gui.Window.View.VideoPlayer.prototype.symbolStop = '&#9632;';

/**
 * @type {string}
 */
Gui.Window.View.VideoPlayer.prototype.symbolNext = '&#9650;';

/**
 * @type {string}
 */
Gui.Window.View.VideoPlayer.prototype.symbolPrevious = '&#9660;';

/**
 * @type {string}
 */
Gui.Window.View.VideoPlayer.prototype.symbolFullscreen = '&#9701;';

/**
 * @type {string}
 */
Gui.Window.View.VideoPlayer.prototype.symbolQuality = 'Q';

/**
 * @type {string}
 */
Gui.Window.View.VideoPlayer.prototype.symbolMinimize = '_';
//Gui.Window.View.VideoPlayer.prototype.symbolMinimize = '&#9881;';
//Gui.Window.View.VideoPlayer.prototype.symbolMinimize = '&#x1f50a;';
//Gui.Window.View.VideoPlayer.prototype.symbolMinimize = '&#x1f592;';

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
};

/**
 * decorate and render
 */
Gui.Window.View.VideoPlayer.prototype.render = function () {

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.addClasses();

    this.setPosition();

    this.node.toggleClass('collapsed expand');
    this.player.attr('poster', this.module.getHelper('VideoPlayer').defaultPoster(this.video));

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
    this.addControls();

    return this;
};

/**
 * add control elements
 */
Gui.Window.View.VideoPlayer.prototype.addControls = function () {

    this.addControlButtons();
    this.controls.appendTo(this.node);
    this.addThrobber();
    this.addProgress();
    this.updateProgress();
    this.addQualitySelector();
    this.addTitle();

    return this;
};

/**
 * add control buttons to overlay
 */
Gui.Window.View.VideoPlayer.prototype.addControlButtons = function () {

    var volume;

    this.ctrlPlay = $(
        '<div class="play">' + this.symbolPlay + '</div>'
    ).appendTo(this.controls);

    this.ctrlStop = $(
        '<div class="stop">' + this.symbolStop + '</div>'
    ).appendTo(this.controls);

    this.ctrlFullScreen = $(
        '<div class="toggle-fullScreen">' + this.symbolFullscreen + '</div>'
    ).appendTo(this.controls);

    this.ctrlQuality = $(
        '<div class="toggle-quality">' + this.symbolQuality + '</div>'
    ).appendTo(this.controls);


    this.ctrlMinimize = $(
        '<div class="minimize">' + this.symbolMinimize + '</div>'
    ).appendTo(this.controls);

    this.ctrlVolume = $('<div class="slider volume">').appendTo(this.controls);
    this.volumeSlider = $('<div>').appendTo(this.ctrlVolume);
    this.volumeIndicator = $(
        '<div class="info volume-indicator">'
    ).hide().appendTo(this.controls);

    this.ctrlTimeline = $('<div class="slider timeline">').appendTo(this.controls);
    this.timelineSlider = $('<div>').appendTo(this.ctrlTimeline);

    volume = VDRest.config.getItem('html5VideoPlayerVol') || 1;
    this.video.volume = parseFloat(volume);

    this.setVolumeSliderHeight();
    this.setTimelineSliderWidth();

    if (this.data.isTv) {
        this.ctrlChannelUp = $(
            '<div class="channel-up">' + this.symbolNext + '</div>'
        ).appendTo(this.controls);
        this.ctrlChannelDown = $(
            '<div class="channel-down">' + this.symbolPrevious + '</div>'
        ).appendTo(this.controls);
    }
};

/**
 * toggle minimized class
 */
Gui.Window.View.VideoPlayer.prototype.toggleMinimize = function () {

    $('body').toggleClass('video-minimized');
};

/**
 * set height of volume slider
 */
Gui.Window.View.VideoPlayer.prototype.setVolumeSliderHeight = function () {

    var percentage = this.getVolumePercentage();

    this.volumeSlider.css({
        "top" : percentage
    });
    if (percentage === '1px') {
        percentage = 0;
    }
    percentage = 100 - parseInt(percentage);

    this.volumeIndicator.text(percentage.toString() + '%');
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
Gui.Window.View.VideoPlayer.prototype.toggleControls = function () {

    if (this.omitToggleControls) {
        this.omitToggleControls = undefined;
        return;
    }

    this.stopHideControls();

    if (this.controls.hasClass('show')) {
        this.controls.removeClass('show');
        this.qualitySelect.removeClass('show');
    } else {

        this.controls.addClass('show');
        this.deferHideControls();
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

    if ("undefined" != typeof this.progress) {
        this.progress.remove();
        delete this.progress;
    }

    this.progress = $('<div class="progress info">' + this.data.progress + '</div>');
    this.progress.appendTo(this.controls);
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

    this.progress.text(this.getProgress(time));
    this.setTimelineSliderWidth();
};

/**
 * convert time to string
 * @param {float} time
 * @returns {string}
 */
Gui.Window.View.VideoPlayer.prototype.getProgress = function (time) {

    var minutes = Math.floor(time / 60),
        seconds = this.helper().pad(parseInt(time - minutes * 60), 2),
        hours = Math.floor(time / 3600);

    minutes = this.helper().pad(minutes - hours * 60, 2);

    return hours + ':' + minutes + ':' + seconds;
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

    this.controls.append(this.infoArea);
};

/**
 * add classes
 * @returns {Gui.Window.View.VideoPlayer}
 */
Gui.Window.View.VideoPlayer.prototype.addClasses = function () {

    var classNames = ['html5-player', 'fullsize', 'collapsed'];

    classNames.push(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');

    this.node.addClass(classNames.join(' '));

    return this;
};

/**
 * center video
 */
Gui.Window.View.VideoPlayer.prototype.setPosition = function () {

    var me = this;

    setTimeout(function () {
        if (window.innerHeight > window.innerWidth) {
            me.node.removeClass('landscape').addClass('portrait');
        } else {
            me.node.removeClass('portrait').addClass('landscape');
        }
    }, 1000);
};

/**
 * destroy window
 */
Gui.Window.View.VideoPlayer.prototype.destruct = function () {

    var me = this, player = this.player.get(0);

    if ("undefined" != typeof this.changeTitleTimeout) {
        clearTimeout(this.changeTitleTimeout);
    }

    player.pause();
    this.player.prop('src', false);

    Gui.Window.View.Abstract.prototype.destruct.call(me);
};