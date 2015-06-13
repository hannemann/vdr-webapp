/**
 * @constructor
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype = new Gui.Video.Controller.Player.Controls.Osd.TimeLine();

/**
 * @type {boolean}
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.bypassCache = true;

Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.getPercentage = function () {

    var percentage;

    percentage = 100 - (
        100 * (
            this.player.getData('startTime') + this.player.video.getCurrentTime()
        ) / this.player.data.sourceModel.getData('duration')
    );

    return percentage <= 0 ? '1px' : percentage.toString() + '%';
};

/**
 * @param {Number} [time]
 * update timer
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.prototype.updateProgress = function (time) {

    if (isNaN(time)) {
        time = this.player.getData('startTime') + this.player.video.getCurrentTime();
    }

    this.view.currentProgress.text(this.helper().getDurationAsString(time, true));
    this.view.setSliderWidth(this.getPercentage());
    return this;
};
