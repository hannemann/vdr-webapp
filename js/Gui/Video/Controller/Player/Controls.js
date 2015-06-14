/**
 * @constructor
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
    this.getLayer();
};

Gui.Video.Controller.Player.Controls.prototype.getLayer = function () {

    var type;

    if (this.player.data.isTv) {
        type = 'Tv';
    }

    if (this.player.data.isVideo) {
        type = 'Video';
    }

    if (this.player.mode == 'cut') {
        type = 'Cut';
    }

    this.layer = this.module.getController('Player.Controls.Layer.' + type, {
        "parent" : this
    });
    this.addObserver();
    this.layer.dispatchView();
};

/**
 * add event listeners
 */
Gui.Video.Controller.Player.Controls.prototype.addObserver = function () {

    this.view.node.on('click', this.destructView.bind(this));
};

/**
 * add event listeners
 */
Gui.Video.Controller.Player.Controls.prototype.removeObserver = function () {

    this.view.node.off('click');
};

/**
 * defer hiding controls
 */
Gui.Video.Controller.Player.Controls.prototype.deferHide = function () {

    this.omitDestruct = undefined;
    this.controlsTimeout = setTimeout(function () {
        this.destructView();
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
 * destruct view
 */
Gui.Video.Controller.Player.Controls.prototype.destructView = function (e) {

    if (e instanceof jQuery.Event) {
        e.stopPropagation();
    }

    if (this.omitDestruct) {
        this.omitDestruct = undefined;
        return;
    }

    var er = new Error();
    console.log(er.stack);

    this.view.node.one(this.transitionEndEvents, function () {
        this.stopHide();
        this.layer.destructView();
        VDRest.Abstract.Controller.prototype.destructView.call(this);
        delete this.player.controls;
    }.bind(this));

    this.view.node.removeClass('show');
};
