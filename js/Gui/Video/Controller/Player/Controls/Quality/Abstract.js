/**
 * @constructor
 */
Gui.Video.Controller.Player.Controls.Quality.Abstract = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Video.Controller.Player.Controls.Quality.Abstract.prototype = new VDRest.Abstract.Controller();

/**
 * @type {boolean}
 */
Gui.Video.Controller.Player.Controls.Quality.Abstract.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Video.Controller.Player.Controls.Quality.Abstract.prototype.init = function () {

    this.controls = this.data.parent.data.parent;
    this.player = this.data.parent.player;

    this.view = this.module.getView('Player.Controls.Quality.' + this.type, {
        "player" : this.player,
        "selected" : VDRest.config.getItem('videoQuality' + this.type)
    });
    this.view.setParentView(this.data.parent.view);

    this.handleDown = this.qualitySelectDown.bind(this);
    this.handleMove = this.qualitySelectMove.bind(this);
    this.handleUp = this.qualitySelectUp.bind(this);
};

/**
 * dispatch view
 */
Gui.Video.Controller.Player.Controls.Quality.Abstract.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    this.addObserver();
};

/**
 * add event listeners
 */
Gui.Video.Controller.Player.Controls.Quality.Abstract.prototype.addObserver = function () {

    this.view.node.on(VDRest.helper.pointerStart, this.handleDown);
};

/**
 * remove event listeners
 */
Gui.Video.Controller.Player.Controls.Quality.Abstract.prototype.removeObserver = function () {

    this.view.node.off(VDRest.helper.pointerStart);
};

/**
 * handle quality selector down
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.Controls.Quality.Abstract.prototype.qualitySelectDown = function (e) {

    e.preventDefault();
    e.stopPropagation();

    this.controls.stopHide();

    if (this.player.isPlaying) {
        this.player.pausePlayback();
    }
    this.controls.omitDestruct = true;

    this.view.toggleActiveState();

    if ('touchstart' === e.type) {
        this.qualityTouchPos = e.originalEvent.changedTouches[0].pageY;
    } else {
        this.qualityTouchPos = e.pageY;
    }

    $document.one(VDRest.helper.pointerEnd, this.handleUp);
    $document.on(VDRest.helper.pointerMove, this.handleMove);
};

/**
 * handle quality selector move
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.Controls.Quality.Abstract.prototype.qualitySelectMove = function (e) {

    var current = this.view.optionList.find('.item.selected');

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

        this.view.optionList.animate({
            "top" : - this.view.optionList.find('.item.selected').position().top + 'px'
        }, function () {
            this.qualityTouchPos = e.type === 'touchmove'
                ? e.originalEvent.changedTouches[0].pageY
                : e.pageY;
            this.qualityAnimating = false;
        }.bind(this));
    }
};

/**
 * handle quality selector up
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.Controls.Quality.Abstract.prototype.qualitySelectUp = function (e) {

    if (e instanceof jQuery.Event) {
        e.preventDefault();
        e.stopPropagation();
    }

    VDRest.config.setItem(
        'videoQuality' + this.type,
        this.view.optionList.find('.item.selected').text()
    );

    this.view.toggleActiveState();
    $document.off(VDRest.helper.pointerMove, this.handleMove);
};
