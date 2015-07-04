/**
 * @constructor
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype = new Gui.Video.Controller.Player.Controls.Osd.TimeLine();

Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.addObserver = function () {

    this.view.node.on(VDRest.helper.pointerStart, this.setTimeDown.bind(this));
};

Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.removeObserver = function () {

    this.view.node.off(VDRest.helper.pointerStart);
};

/**
 * retrieve percentage css value
 * @return {string}
 */
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
 * update timer
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.updateProgress = function () {

    var progress = this.player.data.startTime + this.player.video.getCurrentTime();

    this.view.currentProgress.text(VDRest.helper.getDurationAsString(progress, true));
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
                new Date(Date.now()
                    + duration * 1000
                    - this.player.data.startTime * 1000
                )
            ));
        }.bind(this), 1000);
    } else {
        clearInterval(this.endTimeInterval);
    }
};

/**
 * update start and end time
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.updateRecordingStartEndTime = function () {

    var duration = this.player.data.sourceModel.getData('duration'),
        end, d = new Date();

    end = VDRest.helper.getTimeString(new Date(d.getTime() + duration * 1000 - this.player.data.startTime * 1000));

    this.view.end.text(end);
    this.view.start.text(VDRest.helper.getTimeString(d));
};

/**
 * handle start startTime change
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.setTimeDown = function (e) {

    e.stopPropagation();
    e.preventDefault();

    this.spoolTimeout = setTimeout(this.spool.bind(this), 2000);

    this.player.controls.stopHide();
    if (this.player.isPlaying) {
        this.player.pausePlayback();
        this.player.controls.layer.triggerPlay.view.setState('off');
    }

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
            .setVideoPoster(this.player.getPosterOptions());

        this.fetchPoster = undefined;
    }
    this.toggleActiveState();
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

    var duration = this.player.data.sourceModel.getData('duration');

    value = value || 1;
    if (action === 'increase') {
        this.player.data.startTime +=value;
    } else {
        this.player.data.startTime -= value;
    }
    if (this.player.data.startTime < 0) {
        this.player.data.startTime = 0;
    }
    if (this.player.data.startTime > duration) {
        this.player.data.startTime = duration;
    }
    this.view.setData('startTime', this.player.data.startTime);
    this.updateProgress();
};

/**
 * handle spooling
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.spool = function () {

    var me = this,
        slider = this.view.slider,
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

/**
 * destruct
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.destructView = function () {

    if ("undefined" !== this.endTimeInterval) {
        clearInterval(this.endTimeInterval);
        this.endTimeInterval = undefined;
    }
    if ("undefined" !== this.spoolInterval) {
        clearInterval(this.spoolInterval);
        this.spoolInterval = undefined;
    }
    Gui.Video.Controller.Player.Controls.Osd.TimeLine.prototype.destructView.call(this);
};
