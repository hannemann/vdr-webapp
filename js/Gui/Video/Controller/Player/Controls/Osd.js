/**
 * @constructor
 */
Gui.Video.Controller.Player.Controls.Osd = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Video.Controller.Player.Controls.Osd.prototype = new VDRest.Abstract.Controller();

/**
 * @type {boolean}
 */
Gui.Video.Controller.Player.Controls.Osd.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Video.Controller.Player.Controls.Osd.prototype.init = function () {

    var timeLineType;

    this.player = this.data.parent.player;

    this.view = this.module.getView('Player.Controls.Osd', {
        "player" : this.player
    });
    this.view.setParentView(this.data.parent.view);

    if (this.player.data.isTv) {
        timeLineType = 'Tv';
    }

    if (this.player.data.isVideo) {
        timeLineType = 'Video';
    }

    if (this.player.mode == 'cut') {
        timeLineType = 'Cut';
    }

    this.timeLine = this.module.getController('Player.Controls.Osd.TimeLine', {
        "parent" : this
    });
};

/**
 * dispatch view
 */
Gui.Video.Controller.Player.Controls.Osd.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    this.timeLine.dispatchView();
};

/**
 * add event listeners
 */
Gui.Video.Controller.Player.Controls.Osd.prototype.addObserver = function () {

    this.view.node.on(VDRest.helper.pointerEnd, this.player.toggleControls.bind(this.player));
    this.view.node.on(VDRest.helper.pointerStart, this.player.setTimeDown.bind(this.player));
};

/**
 * remove event listeners
 */
Gui.Video.Controller.Player.Controls.Osd.prototype.removeObserver = function () {

    this.view.node.off(VDRest.helper.pointerEnd);
    this.view.node.off(VDRest.helper.pointerStart);
};

/**
 * destruct view
 */
Gui.Video.Controller.Player.Controls.Osd.prototype.destructView = function () {

    this.timeLine.destructView();
    delete this.timeLine;
    VDRest.Abstract.Controller.prototype.destructView.call(this);
};
