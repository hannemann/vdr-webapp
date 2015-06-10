/**
 * @constructor
 */
Gui.Video.Controller.Player.Osd = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Video.Controller.Player.Osd.prototype = new VDRest.Abstract.Controller();

/**
 * initialize
 */
Gui.Video.Controller.Player.Osd.prototype.init = function () {

    this.player = this.data.parent;

    this.view = this.module.getView('Player.Osd', {
        "player" : this.player
    });
    this.view.setParentView(this.player.view);
};

/**
 * dispatch view
 */
Gui.Video.Controller.Player.Osd.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
};

/**
 * add event listeners
 */
Gui.Video.Controller.Player.Osd.prototype.addObserver = function () {

    this.view.node.on(VDRest.helper.pointerEnd, this.player.toggleControls.bind(this.player));
    this.view.node.on(VDRest.helper.pointerStart, this.player.setTimeDown.bind(this.player));
};

/**
 * remove event listeners
 */
Gui.Video.Controller.Player.Osd.prototype.removeObserver = function () {

    this.view.node.off(VDRest.helper.pointerEnd);
    this.view.node.off(VDRest.helper.pointerStart);
};
