/**
 * @constructor
 */
Gui.Video.Controller.Player.Controls.Volume = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Video.Controller.Player.Controls.Volume.prototype = new VDRest.Abstract.Controller();

/**
 * @type {boolean}
 */
Gui.Video.Controller.Player.Controls.Volume.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Video.Controller.Player.Controls.Volume.prototype.init = function () {

    this.player = this.data.player;

    this.view = this.module.getView('Player.Controls.Volume', {
        "player" : this.player
    });
    this.view.setParentView(this.data.parent.view);
};

/**
 * dispatch view
 */
Gui.Video.Controller.Player.Controls.Volume.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    this.addObserver()
};

/**
 * add event listeners
 */
Gui.Video.Controller.Player.Controls.Volume.prototype.addObserver = function () {

    this.view.ctrl.on('mousedown touchstart', this.volumeDown.bind(this));
    this.view.ctrl.on('click', VDRest.helper.stopPropagation);
};

/**
 * remove event listeners
 */
Gui.Video.Controller.Player.Controls.Volume.prototype.removeObserver = function () {

    this.view.ctrl.off('mousedown touchstart click');
};

/**
 * handle start volume change
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.Controls.Volume.prototype.volumeDown = function (e) {

    if (this.player.controls.isHidden) {
        return;
    }

    this.player.view.toggleQuality(false);

    e.stopPropagation();
    e.preventDefault();
    $document.one('mouseup.videoplayer-volume touchend.videoplayer-volume', this.volumeUp.bind(this));

    this.player.controls.stopHide();
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
    this.view.indicator.on(this.transitionEndEvents, function () {
        this.view.indicator.off(this.transitionEndEvents);
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
Gui.Video.Controller.Player.Controls.Volume.prototype.volumeUp = function (e) {

    e.stopPropagation();
    e.preventDefault();
    this.isAllowedUpdateVolume = undefined;
    $document.off('mousemove.videoplayer-volume touchmove.videoplayer-volume');
    $document.off('mouseup.videoplayer-volume touchend.videoplayer-volume');
    this.view.toggleVolumeIndicator(false);
    this.view.toggleVolumeSliderActiveState();
};

/**
 * handle volume change
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.Controls.Volume.prototype.volumeMove = function (e) {

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
Gui.Video.Controller.Player.Controls.Volume.prototype.setVolume = function (action) {

    var vol = this.player.video.getVolume(),
        value = 0.01;

    if ('increase' == action) {

        this.player.video.setVolume(vol + value > 1 ? 1 : vol + value);
    } else {

        this.player.video.setVolume(vol - value < 0 ? 0 : vol - value);
    }
    VDRest.config.setItem('html5VideoPlayerVol', this.player.video.getVolume());
    this.view.setVolumeSliderHeight();
};
