Gui.Video.View.Player.Controls.Osd.TimeLine.Video = function () {};

Gui.Video.View.Player.Controls.Osd.TimeLine.Video.prototype = new Gui.Video.View.Player.Controls.Osd.TimeLine();

/**
 * add timer
 */
Gui.Video.View.Player.Controls.Osd.TimeLine.Video.prototype.addProgress = function () {

    var start, end, duration;

    Gui.Video.View.Player.Controls.Osd.TimeLine.prototype.addProgress.call(this);

    start = new Date(this.player.data.startDate + this.player.data.startTime * 1000);
    duration = this.player.data.sourceModel.getData('duration');
    end = VDRest.helper.getTimeString(
        new Date(Date.now() + duration * 1000)
    );
    start = VDRest.helper.getTimeString(start);
    duration = VDRest.helper.getDurationAsString(duration, true);

    this.start.text(start);
    this.end.text(end);
    this.duration.html('&nbsp;/&nbsp;' + duration);
    this.progress.insertAfter(this.parentView.infoArea);

    return this;
};
