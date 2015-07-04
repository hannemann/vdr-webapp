/**
 * @constructor
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.Mark = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.Mark.prototype = new VDRest.Abstract.Controller();

/**
 * @type {boolean}
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.Mark.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.Mark.prototype.init = function () {

    this.player = this.data.parent.player;
    this.view = this.module.getView('Player.Controls.Osd.TimeLine.Cut.Mark', this.data);
    this.view.setParentView(this.data.parent.view);
    this.duration = this.player.data.sourceModel.data.duration;
    this.data.frameDistance = 1000 / this.player.data.sourceModel.data.frames_per_second;
    this.data.position = this.getPosition();
};

/**
 * retrieve percentage css value
 * @return {string}
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.Mark.prototype.getPosition = function () {

    var percentage;

    percentage = 100 * this.timestampToFloat() / this.duration;

    this.position = percentage <= 0 ? '1px' : percentage.toString() + '%';

    return this.position;
};

/**
 * retrieve timestamp value as float
 * @return {Number}
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.Mark.prototype.timestampToFloat = function () {

    var hh = 0, mm = 0, ss = 0, ff = 0;

    this.data.timestamp.split(':').forEach(function (v, i) {

        switch (i) {
            case 0:
                hh = parseInt(v, 10) * 60 * 60;
                break;
            case 1:
                mm = parseInt(v, 10) * 60;
                break;
            case 2:
                if (v.indexOf('.') > -1) {
                    ff = (v.split('.')[1] * this.data.frameDistance) / 1000;
                }
                ss = parseInt(v);
                break;
        }
    }.bind(this));

    return hh + mm + ss + ff;
};

/**
 * retrieve float value as timestamp
 * @return {String}
 */
Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.Mark.prototype.floatToTimestamp = function (float) {

    var ts = [], hh, mm, ss, ff;

    hh = parseInt(float / 3600, 10);
    mm = parseInt((float - hh * 3600) / 60, 10);
    ss = (float - (hh * 3600) - (mm * 60)).toFixed(2);
    ff = (parseFloat('0.' + ss.split('.')[1]) * 1000) / this.data.frameDistance;
    ss = ss.split('.')[0];

    ts.push(hh);
    ts.push(VDRest.helper.pad(mm, 2));
    ts.push([VDRest.helper.pad(ss, 2), VDRest.helper.pad(ff, 2)].join('.'));

    return ts.join(':');
};

Gui.Video.Controller.Player.Controls.Osd.TimeLine.Cut.Mark.prototype.moveByFrames = function (frames) {

    this.data.timestamp = this.floatToTimestamp(this.timestampToFloat() + (frames * this.data.frameDistance / 1000));
};
