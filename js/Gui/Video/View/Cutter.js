Gui.Video.View.Cutter = function () {
};

Gui.Video.View.Cutter.prototype = new VDRest.Abstract.View();

/**
 * decorate and render
 */
Gui.Video.View.Cutter.prototype.render = function () {

    this.node = this.parentView.node;

    this.controls = $('<div class="html5-player-controls show">');
    this.controls.attr('data-animate', 'opacity');
    this.osd = $('<div class="video-osd">').appendTo(this.controls);
    this.controls.appendTo(this.node);

    this.addTimeLine().addProgress();
};

/**
 * add timeline
 * @returns {Gui.Video.View.Cutter}
 */
Gui.Video.View.Cutter.prototype.addTimeLine = function () {

    this.ctrlTimeline = $('<div class="slider timeline">').appendTo(this.osd);
    this.timelineSlider = $('<div>').appendTo(this.ctrlTimeline);

    return this;
};

/**
 * add timer
 */
Gui.Video.View.Cutter.prototype.addProgress = function () {

    var start, end, duration, helper = this.helper();

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

    start = helper.getTimeString(new Date());
    duration = this.data.sourceModel.getData('duration');
    end = helper.getTimeString(
        new Date(new Date().getTime() + duration * 1000)
    );
    duration = helper.getDurationAsString(duration, true);

    this.start.text(start);
    this.end.text(end);
    this.duration.html('&nbsp;/&nbsp;' + duration);

    this.progress.appendTo(this.osd);
    return this;
};