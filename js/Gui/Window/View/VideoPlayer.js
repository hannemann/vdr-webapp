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
Gui.Window.View.VideoPlayer.prototype.symbolMinimize = '_';
Gui.Window.View.VideoPlayer.prototype.symbolMinimize = '&#9881;';

/**
 * initialize video node
 */
Gui.Window.View.VideoPlayer.prototype.init = function () {

    this.node = $('<div class="video-player-wrapper">');
    this.player = $('<video preload="none" class="normal-size">');
    this.video = this.player.get(0);
    this.controls = $('<div class="html5-player-controls show" data-animate="opacity">');
    this.player.prop('crossOrigin', 'anonymous');
    this.startTime = 0;

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
    this.addTitle();

    return this;
};

/**
 * add control buttons to overlay
 */
Gui.Window.View.VideoPlayer.prototype.addControlButtons = function () {

    this.ctrlPlay = $('<div class="play">' + this.symbolPlay + '</div>').appendTo(this.controls);

    this.ctrlStop = $('<div class="stop">' + this.symbolStop + '</div>').appendTo(this.controls);

    this.ctrlFullScreen = $('<div class="toggle-fullScreen">' + this.symbolFullscreen + '</div>').appendTo(this.controls);


    this.ctrlMinimize = $('<div class="minimize">' + this.symbolMinimize + '</div>').appendTo(this.controls);

    this.ctrlVolume = $('<div class="volume">').appendTo(this.controls);
    this.volumeSlider = $('<div>').appendTo(this.ctrlVolume);
    this.setVolumeSliderHeight();

    if (this.data.isTv) {
        this.ctrlChannelUp = $('<div class="channel-up">' + this.symbolNext + '</div>').appendTo(this.controls);
        this.ctrlChannelDown = $('<div class="channel-down">' + this.symbolPrevious + '</div>').appendTo(this.controls);
    }
};

Gui.Window.View.VideoPlayer.prototype.toggleMinimize = function () {

    $('body').toggleClass('video-minimized');
};

/**
 * set height of volume slider
 */
Gui.Window.View.VideoPlayer.prototype.setVolumeSliderHeight = function () {

    this.volumeSlider.css({
        "top" : this.getVolumePercentage()
    });
};

/**
 * retrieve css top property fpr volumeslider
 * @returns {string}
 */
Gui.Window.View.VideoPlayer.prototype.getVolumePercentage = function () {

    var percentage = 100 - (this.player.get(0).volume * 100);

    return percentage == 0 ? '1px' : percentage.toString() + '%';
};

/**
 * show controls overlay
 */
Gui.Window.View.VideoPlayer.prototype.toggleControls = function () {

    var me = this;
    if ("undefined" !== typeof this.controlsTimeout) {
        clearTimeout(this.controlsTimeout);
        this.controlsTimeout = undefined;
    }

    this.controls.toggleClass('show');

    if (this.controls.hasClass('show')) {

        me.controlsTimeout = setTimeout(function () {
            me.controls.removeClass('show');
        }, 5000);
    }
};

/**
 * add throbber
 */
Gui.Window.View.VideoPlayer.prototype.addThrobber = function () {

    this.throbber = $('<div style="background: url(' + VDRest.image.getThrobber() + ')" class="throbber">');
    this.throbber.appendTo(this.node);
};

/**
 * toggle throbber
 */
Gui.Window.View.VideoPlayer.prototype.toggleThrobber = function () {

    this.throbber.toggleClass('show');
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
 * update timer
 */
Gui.Window.View.VideoPlayer.prototype.updateProgress = function () {

    this.progress.text(this.getProgress());
};

/**
 * convert time to string
 * @param {float} [time]
 * @returns {string}
 */
Gui.Window.View.VideoPlayer.prototype.getProgress = function (time) {

    time = time || this.video.currentTime + this.startTime;

    var minutes = this.helper().pad(Math.floor(time / 60), 2),
        seconds = this.helper().pad(parseInt(time - minutes * 60), 2),
        hours = Math.floor(time / 3600);

    return hours + ':' + minutes + ':' + seconds;
};

Gui.Window.View.VideoPlayer.prototype.addTitle = function () {

    var text = [], broadcast, now, me = this, end;

    if (this.title) {
        this.title.remove();
    }
    if (this.subTitle) {
        this.subTitle.remove();
    }

    this.title = $('<div class="title info">');

    if (this.data.isVideo) {
        text.push(this.title.text(this.data.recording.resource.event_title));
        if ('' !== this.data.recording.resource.event_short_text) {
            this.subTitle = $('<div class="short-text info">');
            text.push(
                this.subTitle.text(this.data.recording.resource.event_short_text)
            );
        }
    } else {

        if ("undefined" != typeof this.changeTitleTimeout) {
            clearTimeout(this.changeTitleTimeout);
        }

        broadcast = this.data.channel.dataModel.getCurrentBroadcast();
        text.push(
            this.title.text(
                this.data.channel.dataModel.getData('name')
                + ' - '
                + broadcast.getData('title')
            )
        );
        if ('' !== broadcast.getData('short_text')) {
            this.subTitle = $('<div class="short-text info">');
            text.push(
                this.subTitle.text(broadcast.getData('short_text'))
            );
        }
        now = new Date().getTime()/1000;
        end = (broadcast.getData('end_time') + 10 - parseInt(now, 10)) * 1000;

        this.changeTitleTimeout = setTimeout(function () {
            me.addTitle();
        }, end);
    }

    this.controls.append(text);
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