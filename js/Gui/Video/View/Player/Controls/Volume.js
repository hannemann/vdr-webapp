/**
 * @constructor
 */
Gui.Video.View.Player.Controls.Volume = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Video.View.Player.Controls.Volume.prototype = new VDRest.Abstract.View();

/**
 * initialize
 */
Gui.Video.View.Player.Controls.Volume.prototype.init = function () {

    this.player = this.data.player;

    this.node = $('<div class="volume-wrapper">');
    this.ctrl = $('<div class="slider volume">').appendTo(this.node);
    this.volumeSlider = $('<div>').appendTo(this.ctrl);
    this.indicator = $('<div class="vdr-web-symbol info volume-indicator">');
    this.indicator.attr('data-animate', 'opacity fast');
    this.indicatorLabel = $('<span class="label">').appendTo(
        this.indicator
    );
    this.indicatorValue = $('<span class="value">').appendTo(
        this.indicator
    );
};

/**
 * render
 */
Gui.Video.View.Player.Controls.Volume.prototype.render = function () {

    this.setInitialVolume();
    VDRest.Abstract.View.prototype.render.call(this);
    this.node.appendTo(this.player.controls.view.node);
    this.indicator.appendTo(this.player.controls.view.node);
};

/**
 * set initial volume
 */
Gui.Video.View.Player.Controls.Volume.prototype.setInitialVolume = function () {

    var volume = VDRest.config.getItem('html5VideoPlayerVol') || 1;
    this.player.video.setVolume(parseFloat(volume));
    this.updateVolumeIndicator(this.getVolumePercentage());

    return this;
};

/**
 * toggle active state of volume slider
 */
Gui.Video.View.Player.Controls.Volume.prototype.toggleVolumeSliderActiveState = function () {

    this.ctrl.toggleClass('active');
};

/**
 * set height of volume slider
 */
Gui.Video.View.Player.Controls.Volume.prototype.setVolumeSliderHeight = function () {

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
Gui.Video.View.Player.Controls.Volume.prototype.updateVolumeIndicator = function () {

    var symbol, value = this.getVolumePercentage();

    if (value == 0) {
        symbol = 'U';
    } else if (value <= 50) {
        symbol = 'V';
    } else {
        symbol = 'W';
    }

    this.indicatorLabel.text(symbol);
    this.indicatorValue.text(value.toString() + '%');
};

/**
 * toggle volume indicator visibility
 * @param {Boolean} show
 */
Gui.Video.View.Player.Controls.Volume.prototype.toggleVolumeIndicator = function (show) {

    show = !!show;
    this.indicator.toggleClass('show', show);
};

/**
 * retrieve css top property for volumeslider
 * @returns {string}
 */
Gui.Video.View.Player.Controls.Volume.prototype.getVolumeSliderHeight = function () {

    var height = 100 - this.getVolumePercentage();

    return height <= 0 ? '1px' : height.toString() + '%';
};

/**
 * retrieve percentage volume
 * @returns {int}
 */
Gui.Video.View.Player.Controls.Volume.prototype.getVolumePercentage = function () {

    return parseInt(this.player.video.getVolume() * 100, 10);
};

/**
 * destroy osd
 */
Gui.Video.View.Player.Controls.Volume.prototype.destruct = function () {

    this.indicatorLabel.remove();
    delete this.indicatorLabel;
    this.indicatorValue.remove();
    delete this.indicatorValue;
    this.indicator.remove();
    delete this.indicator;
    this.volumeSlider.remove();
    delete this.volumeSlider;
    this.ctrl.remove();
    delete this.ctrl;
    Gui.Window.View.Abstract.prototype.destruct.call(this);
};
