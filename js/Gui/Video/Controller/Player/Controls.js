/**
 * @constructor
 * @property {Gui.Video.Controller.Player} player
 * @property {Gui.Video.View.Player.Controls} view
 * @property {(Gui.Video.Controller.Player.Controls.Layer.Video|Gui.Video.Controller.Player.Controls.Layer.Tv|Gui.Video.Controller.Player.Controls.Layer.Cut)} layer
 * @property {boolean} isHidden
 * @property {boolean|undefined} omitDestruct
 */
Gui.Video.Controller.Player.Controls = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Video.Controller.Player.Controls.prototype = new VDRest.Abstract.Controller();

/**
 * @type {boolean}
 */
Gui.Video.Controller.Player.Controls.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Video.Controller.Player.Controls.prototype.init = function () {

    this.player = this.data.parent;

    this.view = this.module.getView('Player.Controls', {
        "player" : this.player
    });
    this.view.setParentView(this.player.view);
    this.isHidden = false;
};

/**
 * dispatch view
 */
Gui.Video.Controller.Player.Controls.prototype.dispatchView = function () {

    this.getLayer();
    this.layer.dispatchView();
    this.view.node.one(this.transitionEndEvents, function () {
        this.addObserver();
    }.bind(this));
    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
};

/**
 * init layer
 */
Gui.Video.Controller.Player.Controls.prototype.getLayer = function () {

    var type;

    if (this.player.data.isMinimized) {
        type = 'Minimized';
    } else if (this.player.data.isTv) {
        type = 'Tv';
    } else if (this.player.data.isVideo) {
        type = 'Video';
    } else if (this.player.mode == 'cut') {
        type = 'Cut';
        this.view.node.addClass('cut');
    }

    this.layer = this.module.getController('Player.Controls.Layer.' + type, {
        "parent" : this
    });
};

/**
 * add event listeners
 */
Gui.Video.Controller.Player.Controls.prototype.addObserver = function () {

    this.view.node.one('click', this.destructView.bind(this, true));
};

/**
 * defer hiding controls
 */
Gui.Video.Controller.Player.Controls.prototype.deferHide = function () {

    this.omitDestruct = undefined;
    this.controlsTimeout = setTimeout(function () {
        this.destructView(true);
    }.bind(this), 5000);
};

/**
 * stop hiding controls
 */
Gui.Video.Controller.Player.Controls.prototype.stopHide = function () {

    this.omitDestruct = true;
    if ("undefined" !== typeof this.controlsTimeout) {
        clearTimeout(this.controlsTimeout);
        this.controlsTimeout = undefined;
    }
};

/**
 * stop hiding controls
 */
Gui.Video.Controller.Player.Controls.prototype.allowHide = function () {

    this.omitDestruct = undefined;
};

/**
 * destruct view
 */
Gui.Video.Controller.Player.Controls.prototype.destructView = function (transition) {

    if (this.player.mode === 'cut') {
        return;
    }

    if (this.omitDestruct) {
        this.omitDestruct = undefined;
        return;
    }

    if (transition) {
        this.view.node.one(this.transitionEndEvents, this.doDestruct.bind(this));
        this.view.node.removeClass('show');
    } else {
        this.doDestruct();
    }
};

/**
 * do destruct view
 */
Gui.Video.Controller.Player.Controls.prototype.doDestruct = function () {

    this.stopHide();
    this.layer.destructView();
    VDRest.Abstract.Controller.prototype.destructView.call(this);
    delete this.player.controls;
    this.player.addControlsObserver();

    if (VDRest.config.getItem('supportChromecast') && this.player.isPlaying) {
        setTimeout(function () {
            document.body.classList.remove('support-chromecast');
        }, 5000);
        document.body.classList.add('support-chromecast');
    }
};
