/**
 * @constructor
 * @property {{marks:Array.<Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.Mark>}} data
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype = new Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video();

Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.steps = [
    {
        "label" : "1s",
        "seconds" : 1
    },
    {
        "label" : "2s",
        "seconds" : 2
    },
    {
        "label" : "5s",
        "seconds" : 5
    },
    {
        "label" : "10s",
        "seconds" : 10
    },
    {
        "label" : "15s",
        "seconds" : 15
    },
    {
        "label" : "30s",
        "seconds" : 30
    },
    {
        "label" : "1m",
        "seconds" : 60
    },
    {
        "label" : "2m",
        "seconds" : 120
    },
    {
        "label" : "5m",
        "seconds" : 300
    },
    {
        "label" : "10m",
        "seconds" : 600
    },
    {
        "label" : "15m",
        "seconds" : 900
    },
    {
        "label" : "30m",
        "seconds" : 1800
    },
    {
        "label" : "60m",
        "seconds" : 3600
    }
];

Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.fineSteps = [
    {
        "label" : "1f",
        "frames" : 1
    },
    {
        "label" : "5f",
        "frames" : 5
    },
    {
        "label" : "10f",
        "frames" : 10
    },
    {
        "label" : "25f",
        "frames" : 25
    },
    {
        "label" : "50f",
        "frames" : 50
    },
    {
        "label" : "100f",
        "frames" : 100
    }
];

/**
 * initialize
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.init = function () {

    Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.init.call(this);
    this.data.marks = [];
    this.moveByFrames = 10;
    this.selectedStep = 8;
    this.selectedFineStep = 6;
};

/**
 * dispatch view
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.dispatchView = function () {

    Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.dispatchView.call(this);

    this.addCuttingMarks();
    this.setMarkerWidth();
    this.setStep(false);
    this.setFineStep(false);
};

/**
 * add event listeners
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.addObserver = function () {

    Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.addObserver.call(this);

    this.view.toggleNextMark.on(VDRest.helper.pointerStart, this.jumpMark.bind(this, 'next'));
    this.view.togglePrevMark.on(VDRest.helper.pointerStart, this.jumpMark.bind(this, 'prev'));
    this.view.addMark.on(VDRest.helper.pointerStart, this.addMark.bind(this));
    this.view.removeMark.on(VDRest.helper.pointerStart, this.removeMark.bind(this));
    this.view.fineStepSettingsDecrease.on(VDRest.helper.pointerStart, this.setFineStep.bind(this, false));
    this.view.fineStepSettingsIncrease.on(VDRest.helper.pointerStart, this.setFineStep.bind(this, true));
    this.view.stepSettingsDecrease.on(VDRest.helper.pointerStart, this.setStep.bind(this, false));
    this.view.stepSettingsIncrease.on(VDRest.helper.pointerStart, this.setStep.bind(this, true));
};

/**
 * remove event listeners
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.removeObserver = function () {

    this.view.toggleNextMark.off(VDRest.helper.pointerStart);
    this.view.togglePrevMark.off(VDRest.helper.pointerStart);
    this.view.addMark.off(VDRest.helper.pointerStart);
    this.view.removeMark.off(VDRest.helper.pointerStart);
    this.view.fineStepSettingsDecrease.off(VDRest.helper.pointerStart);
    this.view.fineStepSettingsIncrease.off(VDRest.helper.pointerStart);
    this.view.stepSettingsDecrease.off(VDRest.helper.pointerStart);
    this.view.stepSettingsIncrease.off(VDRest.helper.pointerStart);
};

Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.setStep = function (increase) {

    this.selectedStep = increase ? this.selectedStep + 1 : this.selectedStep - 1;

    if (this.selectedStep < 0) this.selectedStep = 0;
    if (this.selectedStep >= this.steps.length) this.selectedStep = this.steps.length - 1;

    this.view.stepSettingsIndicator.text(this.steps[this.selectedStep].label);
};

Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.setFineStep = function (increase) {

    this.selectedFineStep = increase ? this.selectedFineStep + 1 : this.selectedFineStep - 1;

    if (this.selectedFineStep < 0) this.selectedFineStep = 0;
    if (this.selectedFineStep >= this.fineSteps.length) this.selectedFineStep = this.fineSteps.length - 1;

    this.view.fineStepSettingsIndicator.text(this.fineSteps[this.selectedFineStep].label);
};

/**
 * add cutting marks
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.addCuttingMarks = function () {

    var marks = this.player.data.sourceModel.data.marks;

    marks.forEach(function (timestamp, index) {

        this.data.marks.push(this.module.getController(
            'Player.Controls.Osd.TimeLine.Cut.Mark', {
                "parent" : this,
                "timestamp" : marks[index]
            }
        ));
        this.data.marks[this.data.marks.length - 1].dispatchView();
    }.bind(this));
};

/**
 * set marker width
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.setMarkerWidth = function () {

    this.data.marks.forEach(function (mark, index) {
        var endPos;
        if (index%2==0) {
            if (index < this.data.marks.length && this.data.marks[index + 1]) {
                endPos = parseFloat(this.data.marks[index + 1].data.position);
            } else {
                endPos = undefined;
            }
            mark.view.setWidth(endPos);
        }
    }.bind(this));
};

/**
 * jump to next or previous mark
 * @param {string} dir
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.jumpMark = function (dir) {

    var index = this.data.activeMark;

    if (this.player.isPlaying) {
        this.player.pausePlayback();
        this.player.controls.layer.triggerPlay.view.toggleState()
    }

    if (0 === this.data.marks.length) {
        this.data.activeMark = 0;
        this.jumpTo('next' === dir ? 'end' : 'start');
        return;
    }

    if ("undefined" === typeof index) {

        index = this.getMarkIndexByTime(dir);
    } else {
        index = 'next' === dir ? index + 1 : index - 1;
    }

    if (index < 0) {
        this.jumpTo('start');
    } else if (index >= this.data.marks.length) {
        this.jumpTo('end');
    } else {
        this.jumpToMark(index);
    }
};

/**
 * retrieve mark index by direction and current timestamp
 * @param {string} dir prev|next
 * @return {number}
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.getMarkIndexByTime = function (dir) {

    var index,
        startTime = this.player.data.startTime,
        marks,
        l = this.data.marks.length;

    marks = JSON.parse(JSON.stringify(this.player.data.sourceModel.data.marks));
    marks.reverse().forEach(function (mark, i) {
        if ("undefined" === typeof index && this.data.marks[l-1-i].timestampToFloat() < startTime) {
            index = l-1-i;
        }
    }.bind(this));

    index = "undefined" === typeof index ? -1 : index;
    index = 'prev' === dir ? index + 1 : index;
    index = 'next' === dir ? index + 1 : index - 1;

    return index;
};



Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.jumpProgress = function (frames) {

    var startTime = this.player.data.startTime,
        fps = this.player.data.sourceModel.data.frames_per_second,
        duration = this.player.data.sourceModel.data.duration;

    startTime += frames * (1000 / fps / 1000);

    if (startTime < 0) startTime = 0;
    if (startTime > duration) startTime = duration;

    this.player.data.startTime = startTime;
    this.player.controls.layer.osd.timeLine.updateProgress();
    this.player.fetchPoster();
};

/**
 * jump to mark
 * @param {number} index
 * @param {boolean} [fetchPoster]
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.jumpToMark = function (index, fetchPoster) {

    if ("undefined" === typeof fetchPoster) fetchPoster = true;

    this.player.data.startTime = this.data.marks[index].timestampToFloat();
    this.player.controls.layer.osd.timeLine.updateProgress();
    this.data.activeMark = index;

    this.data.marks.forEach(function (mark, i) {
        if (i === index) {
            mark.setIsActive();
        } else {
            mark.unsetIsActive();
        }
    }.bind(this));

    this.view.currentProgress.text(this.data.marks[index].data.timestamp);
    fetchPoster && this.player.fetchPoster({"mark" : index});
};

/**
 * jump to start or end
 * @param {string} point
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.jumpTo = function (point) {

    if ('start' === point) {
        this.player.data.startTime = 0;
    } else {
        this.player.data.startTime = this.player.data.sourceModel.data.duration;
    }
    this.player.controls.layer.osd.timeLine.updateProgress();
    if ("undefined" !== typeof this.data.marks[this.data.activeMark]) {
        this.data.marks[this.data.activeMark].unsetIsActive();
    }
    this.data.activeMark = undefined;
    this.player.fetchPoster();
};

/**
 * add cutting mark
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.addMark = function () {

    var startTime = this.player.data.startTime,
        mark = this.module.getController(
            'Player.Controls.Osd.TimeLine.Cut.Mark', {
                "parent" : this,
                "timestamp" : Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.Mark.prototype.floatToTimestamp(
                    startTime,
                    this.player.data.sourceModel.data.frames_per_second
                )
            }
        ), index = 0;

    this.data.marks.forEach(function (m) {
        var f = m.timestampToFloat();
        if (f <= startTime) {
            index+=1;
        }
    }.bind(this));

    this.data.marks.splice(index, 0, mark);
    this.player.data.sourceModel.data.marks.splice(index, 0, mark.data.timestamp);

    if (this.player.isPlaying) {
        this.player.pausePlayback();
        this.player.controls.layer.triggerPlay.view.toggleState()
    }

    if ("undefined" !== this.saveMarkTimeout) {
        clearTimeout(this.saveMarkTimeout);
    }

    this.saveMarkTimeout = setTimeout(function () {
        this.player.video.showThrobber();
        $window.one('gui-recording.cutting-marks-saved.' + this.player.data.sourceModel.keyInCache.toCacheKey(), function () {
            this.player.video.hideThrobber();
            this.deleteMarks();
            this.addCuttingMarks();
            this.setMarkerWidth();
            this.jumpToMark(index, false);
        }.bind(this));
        this.player.data.sourceModel.saveCuttingMarks();
    }.bind(this), 300);
};

/**
 * remove cutting mark
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.removeMark = function () {

    var index = this.data.activeMark;

    if ("undefined" === typeof index) return;

    this.deleteMarks();

    this.data.marks.splice(index, 1);
    this.player.data.sourceModel.data.marks.splice(index, 1);

    if ("undefined" !== this.saveMarkTimeout) {
        clearTimeout(this.saveMarkTimeout);
    }

    if (0 === this.player.data.sourceModel.data.marks.length) {

        this.player.video.showThrobber();
        $window.one('gui-recording.cutting-marks-deleted.' + this.player.data.sourceModel.keyInCache.toCacheKey(), function () {
            this.player.video.hideThrobber();
        }.bind(this));
        this.player.data.sourceModel.deleteCuttingMarks();

    } else {

        this.saveMarkTimeout = setTimeout(function () {
            this.player.video.showThrobber();
            $window.one('gui-recording.cutting-marks-saved.' + this.player.data.sourceModel.keyInCache.toCacheKey(), function () {
                this.player.video.hideThrobber();
                this.addCuttingMarks();
                this.setMarkerWidth();
            }.bind(this));
            this.player.data.sourceModel.saveCuttingMarks();
        }.bind(this), 300);
    }
};

/**
 * delete cutting marks
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.deleteMarks = function () {

    this.data.marks.forEach(function (mark) {
        mark.destructView();
    }.bind(this));
    this.data.marks = [];
};

/**
 * move mark by frames
 * @param {number}index
 * @param {number}frames
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.moveMark = function (index, frames) {

    if ("undefined" === typeof this.data.activeMark) {
        this.jumpProgress(frames);
        return;
    }

    this.data.marks[index].moveByFrames(frames);
    this.player.data.sourceModel.data.marks[index] = this.data.marks[index].data.timestamp;

    this.player.data.startTime = this.data.marks[index].timestampToFloat();
    this.player.controls.layer.osd.timeLine.updateProgress();
    this.view.currentProgress.text(this.data.marks[index].data.timestamp);

    if ("undefined" !== this.saveMarkTimeout) {
        clearTimeout(this.saveMarkTimeout);
    }

    this.saveMarkTimeout = setTimeout(function () {
        this.player.video.showThrobber();
        $window.one('gui-recording.cutting-marks-saved.' + this.player.data.sourceModel.keyInCache.toCacheKey(), function () {
            this.player.video.hideThrobber();
            this.deleteMarks();
            this.addCuttingMarks();
            this.setMarkerWidth();
            this.jumpToMark(index);
        }.bind(this));
        this.player.data.sourceModel.saveCuttingMarks();
    }.bind(this), 300);
};

/**
 * jump to time at 3000ms before next mark and toggle play
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.watchMark = function () {

    var index = this.getMarkIndexByTime('next');

    if (index <= 0) {
        index = 1;
    }

    if (this.player.isPlaying) {
        this.player.pausePlayback();
        this.player.controls.layer.triggerPlay.view.toggleState()
    }

    if ("undefined" !== typeof this.data.activeMark) {
        this.data.marks[this.data.activeMark].unsetIsActive();
    }

    this.player.data.startTime = this.data.marks[index].timestampToFloat() - 3;
    this.updateProgress();
    this.player.fetchPoster();
};

/**
 * destruct
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.destructView = function () {

    Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.destructView.call(this);
};
