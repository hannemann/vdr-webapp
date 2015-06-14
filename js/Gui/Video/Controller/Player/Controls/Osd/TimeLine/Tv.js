/**
 * @constructor
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Tv = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Tv.prototype = new Gui.Video.Controller.Player.Controls.Osd.TimeLine();

/**
 * retrieve percentage css value
 * @return {string}
 */
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
 * update timer
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Tv.prototype.updateProgress = function () {

    var now, progress, broadcast;

    if ("undefined" !== typeof this.progressInterval) {
        clearInterval(this.progressInterval);
    }

    broadcast = this.player.getData('current_broadcast');

    this.progressInterval = setInterval(function () {

        now = parseInt(Date.now() / 1000, 10);
        if (broadcast) {
            progress = now - broadcast.getData('start_time');
        } else {
            progress = 0;
        }

        progress = VDRest.helper.getDurationAsString(progress, true);

        this.player.data.progress = progress;

        this.view.currentProgress.text(progress);
        this.view.setSliderWidth(this.getPercentage());

    }.bind(this), 1000);

    return this;
};

/**
 * destruct
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Tv.prototype.destructView = function () {

    if ("undefined" !== typeof this.progressInterval) {
        clearInterval(this.progressInterval);
    }
    Gui.Video.Controller.Player.Controls.Osd.TimeLine.prototype.destructView.call(this);
};
