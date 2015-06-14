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
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.updateProgress = function (time) {

    if (isNaN(time)) {
        time = this.player.getData('startTime') + this.player.video.getCurrentTime();
    }

    this.view.currentProgress.text(this.helper().getDurationAsString(time, true));
    this.view.setSliderWidth(this.getPercentage());
    return this;
};


/**
 * toggle timeline active state
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.toggleActiveState = function () {

    this.view.node.toggleClass('active');
};

/**
 * update recording end time periodically in case of recording is paused
 * @param {Boolean} action
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.updateRecordingEndTime = function (action) {

    var duration = this.player.data.sourceModel.getData('duration');

    if (action) {
        this.endTimeInterval = setInterval(function () {

            this.view.end.text(VDRest.helper.getTimeString(
                new Date(new Date().getTime()
                    + duration * 1000
                    - this.player.getData('startTime') * 1000
                )
            ));
        }.bind(this), 1000);
    } else {
        clearInterval(this.endTimeInterval);
    }
};

/**
 * handle start startTime change
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.setTimeDown = function (e) {

    if (this.controls.isHidden || this.data.isTv) {
        return;
    }

    e.stopPropagation();
    e.preventDefault();

    this.spoolTimeout = setTimeout(this.spool.bind(this), 2000);

    this.controls.stopHide();
    if (this.isPlaying) {
        this.pausePlayback();
    }
    this.settingParams = true;
    if ('touchstart' === e.type) {
        this.timelineSlidePos = e.originalEvent.changedTouches[0].pageX;
        $document.one('touchend.videoplayer-time', this.setTimeUp.bind(this));
    } else {
        this.timelineSlidePos = e.pageX;
        $document.one('mouseup.videoplayer-time', this.setTimeUp.bind(this));
    }
    this.timelineDownPos = this.timelineSlidePos;
    $document.on('mousemove.videoplayer-time touchmove.videoplayer-time', this.setTimeMove.bind(this));
    this.toggleActiveState();
    this.vibrate();
};

/**
 * handle change startTime stop
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.setTimeUp = function (e) {

    clearTimeout(this.spoolTimeout);
    clearInterval(this.spoolInterval);
    clearInterval(this.increaseValueInterval);
    e.stopPropagation();
    e.preventDefault();

    $document.off('mousemove.videoplayer-time touchmove.videoplayer-time');
    $document.off('touchend.videoplayer-time mouseup.videoplayer-time');

    if ("undefined" !== typeof this.fetchPoster) {
        this.module.getHelper('Player')
            .setVideoPoster(this.getPosterOptions());

        this.fetchPoster = undefined;
    }
    this.view.toggleTimeLineActiveState();
};

/**
 * handle move startTime
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.setTimeMove = function (e) {

    var newPos;

    this.fetchPoster = true;

    e.stopPropagation();
    e.preventDefault();
    newPos = e.type === 'touchmove'
        ? e.originalEvent.changedTouches[0].pageX
        : e.pageX;

    if (Math.abs(newPos - this.timelineDownPos) > 2) {
        clearTimeout(this.spoolTimeout);
    }

    this.setTime(newPos >= this.timelineSlidePos ? 'increase' : 'decrease');
    this.timelineSlidePos = newPos;
};

/**
 * set start time
 * @param {String} action
 * @param {Number} [value]
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.setTime = function (action, value) {

    var sourceModel = this.data.sourceModel;

    value = value || 1;
    if (action === 'increase') {
        this.data.startTime +=value;
    } else {
        this.data.startTime -= value;
    }
    if (this.data.startTime < 0) {
        this.data.startTime = 0;
    }
    if (this.data.startTime > sourceModel.getData('duration')) {
        this.data.startTime = sourceModel.getData('duration');
    }
    this.view.setData('startTime', this.data.startTime);
    this.controls.layer.osd.timeLine.updateProgress(this.data.startTime);
    this.osd.updateInfo();
};

/**
 * handle spooling
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.spool = function () {

    var me = this,
        slider = this.view.timelineSlider,
        timelinePos = slider.offset().left + slider.width();

    this.vibrate(100);

    this.fetchPoster = true;

    $document.off('mousemove.videoplayer-time touchmove.videoplayer-time');

    this.spooling = 5;

    this.increaseValueInterval = setInterval(function () {

        me.spooling += 5;
    }, 1000);

    this.spoolInterval = setInterval(function () {
        me.setTime(
            me.timelineSlidePos > timelinePos ? 'increase' : 'decrease',
            me.spooling
        );
    }, 100);
};
