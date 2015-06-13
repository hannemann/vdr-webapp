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
    this.addProgress();
};

/**
 * @param {number} percentage
 */
Gui.Video.View.Player.Controls.Osd.TimeLine.prototype.setSliderWidth = function (percentage) {

    this.slider.css({
        "right" : percentage
    });
};

/**
 * add timer
 */
Gui.Video.View.Player.Controls.Osd.TimeLine.prototype.addProgress = function () {

    var start, end, duration, helper = this.helper(), broadcast;

    if ("undefined" != typeof this.progress) {
        this.progress.remove();
        delete this.progress;
    }

    this.progress = $('<div class="progress info"></div>');
    this.start = $('<div class="progress-start info">').appendTo(this.progress);
    this.currentProgress = $('<div class="progress-current info">')
        .text(this.data.progress)
        .appendTo(this.progress);
    this.duration = $('<div class="progress-duration info">')
        .appendTo(this.progress);
    this.end = $('<div class="progress-end info">').appendTo(this.progress);

    if (this.player.data.isVideo) {

        start = helper.getTimeString(new Date());
        duration = this.player.data.sourceModel.getData('duration');
        end = helper.getTimeString(
            new Date(Date.now() + duration * 1000)
        );
        duration = helper.getDurationAsString(duration, true);
    } else {
        broadcast = this.player.getData('current_broadcast');
        start = helper.getTimeString(broadcast.getData('start_date'));
        end = helper.getTimeString(broadcast.getData('end_date'));
        duration = helper.getDurationAsString(broadcast.getData('duration'), true);
    }

    this.start.text(start);
    this.end.text(end);
    this.duration.html('&nbsp;/&nbsp;' + duration);

    this.progress.appendTo(this.parentView.node);
    return this;
};
