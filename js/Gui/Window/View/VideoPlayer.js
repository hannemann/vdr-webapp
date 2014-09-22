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

/**
 * initialize video node
 */
Gui.Window.View.VideoPlayer.prototype.init = function () {

    this.node = $('<div class="video-player-wrapper">');
    this.player = $('<video preload="none" class="normal-size">');
    this.controls = $('<div class="html5-player-controls show" data-animate="opacity">');

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
}

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

    player.pause();
    this.player.prop('src', false);

    Gui.Window.View.Abstract.prototype.destruct.call(me);
};