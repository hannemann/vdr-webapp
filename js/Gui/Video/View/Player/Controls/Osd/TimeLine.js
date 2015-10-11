Gui.Video.View.Player.Controls.Osd.TimeLine = function () {};

Gui.Video.View.Player.Controls.Osd.TimeLine.prototype = new VDRest.Abstract.View();

/**
 * @type {boolean}
 */
Gui.Video.View.Player.Controls.Osd.TimeLine.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Video.View.Player.Controls.Osd.TimeLine.prototype.init = function () {

    this.player = this.data.player;

    this.node = $('<div class="slider timeline">');
    this.slider = $('<div>');
};

/**
 * render
 */
Gui.Video.View.Player.Controls.Osd.TimeLine.prototype.render = function () {

    this.addProgress();
    VDRest.Abstract.View.prototype.render.call(this);
    this.slider.appendTo(this.node);
};

/**
 * @param {string} percentage
 */
Gui.Video.View.Player.Controls.Osd.TimeLine.prototype.setSliderWidth = function (percentage) {

    this.slider.css({
        "right" : percentage
    });
};

/**
 * add trigger
 * @return {Gui.Video.View.Player.Controls.Osd.TimeLine}
 */
Gui.Video.View.Player.Controls.Osd.TimeLine.prototype.addTrigger = function () {

    this.trigger = $('<div class="slider-trigger">').appendTo(this.node);
    return this;
};

/**
 * add timer
 */
Gui.Video.View.Player.Controls.Osd.TimeLine.prototype.addProgress = function () {

    if ("undefined" != typeof this.progress) {
        this.progress.remove();
        delete this.progress;
    }

    this.progress = $('<div class="progress info"></div>');
    this.start = $('<div class="progress-start info">').appendTo(this.progress);
    this.currentProgress = $('<div class="progress-current info">')
        .text(this.player.data.progress)
        .appendTo(this.progress);
    this.duration = $('<div class="progress-duration info">')
        .appendTo(this.progress);
    this.end = $('<div class="progress-end info">').appendTo(this.progress);
};

/**
 * destruct
 */
Gui.Video.View.Player.Controls.Osd.TimeLine.prototype.destruct = function () {

    this.progress.remove();
    delete this.progress;
    this.start.remove();
    delete this.start;
    this.currentProgress.remove();
    delete this.currentProgress;
    this.duration.remove();
    delete this.duration;
    this.end.remove();
    delete this.end;
    this.slider.remove();
    delete this.slider;
    delete this.player;

    VDRest.Abstract.View.prototype.destruct.call(this);
};
