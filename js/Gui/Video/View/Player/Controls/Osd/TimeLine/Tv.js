Gui.Video.View.Player.Controls.Osd.TimeLine.Tv = function () {};

Gui.Video.View.Player.Controls.Osd.TimeLine.Tv.prototype = new Gui.Video.View.Player.Controls.Osd.TimeLine();

/**
 * add timer
 */
Gui.Video.View.Player.Controls.Osd.TimeLine.Tv.prototype.addProgress = function () {

    var start, end, duration, broadcast;

    Gui.Video.View.Player.Controls.Osd.TimeLine.prototype.addProgress.call(this);

    broadcast = this.player.getData('current_broadcast');
    start = VDRest.helper.getTimeString(broadcast.getData('start_date'));
    end = VDRest.helper.getTimeString(broadcast.getData('end_date'));
    duration = VDRest.helper.getDurationAsString(broadcast.getData('duration'), true);

    this.start.text(start);
    this.end.text(end);
    this.duration.html('&nbsp;/&nbsp;' + duration);
    this.progress.insertAfter(this.parentView.infoArea);

    return this;
};
