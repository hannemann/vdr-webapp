/**
 * @constructor
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.prototype = new VDRest.Abstract.Controller();

/**
 * @type {boolean}
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.prototype.init = function () {

    this.player = this.data.parent.player;

    this.view = this.module.getView('Player.Controls.Osd.TimeLine', {
        "player" : this.player
    });
    this.view.setParentView(this.data.parent.view);
};
