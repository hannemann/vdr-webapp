Gui.Video.View.Player.Controls.Osd.TimeLine = function () {};

Gui.Video.View.Player.Controls.Osd.TimeLine.prototype = new VDRest.Abstract.View();

/**
 * @type {boolean}
 */
Gui.Video.View.Player.Controls.Osd.TimeLine.prototype.bypassCache = true;

Gui.Video.View.Player.Controls.Osd.TimeLine.prototype.init = function () {

    this.player = this.data.player;

    this.node = $('<div class="slider timeline">');
    this.slider = $('<div>');
};

Gui.Video.View.Player.Controls.Osd.TimeLine.prototype.render = function () {

    VDRest.Abstract.View.prototype.render.call(this);
    this.slider.appendTo(this.node);
    this.setSliderWidth();
};

Gui.Video.View.Player.Controls.Osd.TimeLine.prototype.setSliderWidth = function () {

    this.slider.css({
        "right" : this.getPercentage()
    });
};

Gui.Video.View.Player.Controls.Osd.TimeLine.prototype.getPercentage = function () {

    var percentage, now, broadcast;

    if (this.player.data.isVideo) {
        percentage = 100 - (
        100 * (
        this.getData('startTime') + this.player.video.getCurrentTime()
        ) / this.player.data.sourceModel.getData('duration')
        );
    } else if (this.player.data.isTv) {

        now = parseInt(new Date().getTime() / 1000, 10);
        broadcast = this.player.getData('current_broadcast');
        if (broadcast) {
            percentage = 100 - (
            100 * (
            now - broadcast.getData('start_time')
            ) / broadcast.getData('duration')
            );
        } else {
            percentage = 100;
        }
    }

    return percentage <= 0 ? '1px' : percentage.toString() + '%';
};
