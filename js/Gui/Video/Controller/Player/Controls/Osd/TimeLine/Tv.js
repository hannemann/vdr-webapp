/**
 * @constructor
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Tv = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Tv.prototype = new Gui.Video.Controller.Player.Controls.Osd.TimeLine();

/**
 * @type {boolean}
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Tv.prototype.bypassCache = true;

Gui.Video.Controller.Player.Controls.Osd.TimeLine.Tv.prototype.getPercentage = function () {

    var percentage, now, broadcast;

    now = parseInt(Date.now() / 1000, 10);
    broadcast = this.player.data.current_broadcast;
    if (broadcast) {
        percentage = 100 - (
        100 * (
        now - broadcast.data.start_time
        ) / broadcast.data.duration
        );
    } else {
        percentage = 100;
    }

    return percentage <= 0 ? '1px' : percentage.toString() + '%';
};

/**
 * @param {Number} [time]
 * update timer
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.prototype.updateProgress = function (time) {

    var now, broadcast;

    if (isNaN(time)) {

        now = parseInt(new Date().getTime() / 1000, 10);
        broadcast = this.player.getData('current_broadcast');
        if (broadcast) {
            time = now - broadcast.getData('start_time');
        } else {
            time = 0;
        }
    }

    this.view.currentProgress.text(this.helper().getDurationAsString(time, true));
    this.view.setSliderWidth(this.getPercentage());
    return this;
};
