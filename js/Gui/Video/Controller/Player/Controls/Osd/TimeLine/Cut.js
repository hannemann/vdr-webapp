/**
 * @constructor
 * @property {{marks:Array.<Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.Mark>}} data
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype = new Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video();

/**
 * initialize
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.init = function () {

    Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.init.call(this);
    this.data.marks = [];
};

/**
 * dispatch view
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.dispatchView = function () {

    Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.dispatchView.call(this);

    this.addCuttingMarks();
    this.setMarkerWidth();
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
 * add cutting marks
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.setMarkerWidth = function () {

    this.data.marks.forEach(function (mark, index) {
        var endPos;
        if (index%2==0) {
            if (index < this.data.marks.length) {
                endPos = parseFloat(this.data.marks[index + 1].data.position);
            } else {
                endPos = undefined;
            }
            mark.view.setWidth(endPos);
        }
    }.bind(this));
};

Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.jumpToMark = function (index) {

    this.player.data.startTime = this.data.marks[index].timestampToFloat();
    this.player.controls.layer.osd.timeLine.updateProgress();
    this.module.getHelper('Player')
        .setVideoPoster(this.player.getPosterOptions());
    this.data.activeMark = index;
    this.view.currentProgress.text(this.data.marks[index].data.timestamp);
};

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

    this.data.marks[index].moveByFrames(frames);
    this.player.data.sourceModel.data.marks[index] = this.data.marks[index].data.timestamp;
    this.deleteMarks();
    this.addCuttingMarks();
    this.setMarkerWidth();
    this.jumpToMark(index);
};

/**
 * move mark a minute
 * @param {number} index
 * @param {boolean} [rew]
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.moveMarkAMinute = function (index, rew) {

    var frames = 60 * this.player.data.sourceModel.data.frames_per_second;

    frames *= rew ? -1 : 1;

    this.moveMark(index, frames)
};

/**
 * destruct
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.prototype.destructView = function () {

    Gui.Video.Controller.Player.Controls.Osd.TimeLine.Video.prototype.destructView.call(this);
};
