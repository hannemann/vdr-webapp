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
    this.handlerDown = this.volumeDown.bind(this);
    this.handlerMove = this.volumeMove.bind(this);
    this.handlerUp = this.volumeUp.bind(this);
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

    this.view.trigger.on(VDRest.helper.pointerStart, this.handlerDown);
};

/**
 * remove event listeners
 */
Gui.Video.Controller.Player.Controls.Volume.prototype.removeObserver = function () {

    this.view.trigger.off(VDRest.helper.pointerStart);
};

/**
 * handle start volume change
 * @param {jQuery.Event} e
 * @param {Event} e.originalEvent
 * @param {Object.<{pageX: number, pageY: number}>} e.originalEvent.changedTouches
 * @param {number} e.pageX
 * @param {number} e.pageY
 */
Gui.Video.Controller.Player.Controls.Volume.prototype.volumeDown = function (e) {

    if (this.player.controls.isHidden) {
        return;
    }
    this.vibrate();

    this.player.controls.layer.hideQualitySelector();

    e.stopPropagation();
    e.preventDefault();
    $document.one(VDRest.helper.pointerEnd, this.handlerUp);

    this.player.controls.stopHide();
    if ('touchstart' === e.type) {
        this.volumeSlidePos = e.originalEvent.changedTouches[0].pageY;
    } else {
        this.volumeSlidePos = e.pageY;
    }
    $document.on(
        VDRest.helper.pointerMove,
        this.handlerMove
    );
    this.isAllowedUpdateVolume = false;
    this.view.indicator.on(this.transitionEndEvents, function () {
        this.view.indicator.off(this.transitionEndEvents);
        this.isAllowedUpdateVolume = true;
    }.bind(this));

    this.view.toggleVolumeIndicator(true);
    this.view.toggleVolumeSliderActiveState();
};

/**
 * handle stop volume change
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.Controls.Volume.prototype.volumeUp = function (e) {

    e.stopPropagation();
    e.preventDefault();
    this.isAllowedUpdateVolume = undefined;
    $document.off(VDRest.helper.pointerMove, this.handlerMove);
    $document.off(VDRest.helper.pointerEnd, this.handlerUp);
    this.view.toggleVolumeIndicator(false);
    this.view.toggleVolumeSliderActiveState();
    this.player.controls.allowHide();
};

/**
 * handle volume change
 * @param {jQuery.Event} e
 * @param {Event} e.originalEvent
 * @param {Object.<{pageX: number, pageY: number}>} e.originalEvent.changedTouches
 * @param {number} e.pageX
 * @param {number} e.pageY
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
