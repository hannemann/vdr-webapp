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

    this.player = this.data.parent.player;

    this.view = this.module.getView('Player.Controls.Osd', {
        "player" : this.player
    });
    this.view.setParentView(this.data.parent.view);
};

/**
 * dispatch view
 */
Gui.Video.Controller.Player.Controls.Osd.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
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
