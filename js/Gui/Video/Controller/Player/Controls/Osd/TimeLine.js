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

    this.view = this.module.getView('Player.Controls.Osd.TimeLine.' + this._class.split('.').pop(), {
        "player" : this.player
    });
    this.view.setParentView(this.data.parent.view);
    this.view.setSliderWidth(this.getPercentage());
};

/**
 * initialize
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    this.updateProgress();
};

/**
 * update
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.prototype.update = function () {

    this.removeObserver();
    this.view.addProgress();
    this.updateProgress();
    this.addObserver();
};

/**
 * add event listeners
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.prototype.addObserver = function () {};

/**
 * remove event listeners
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.prototype.removeObserver = function () {};

/**
 * update progress
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.prototype.updateProgress = function () {};

/**
 * update time
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.prototype.updateTime = function () {};
