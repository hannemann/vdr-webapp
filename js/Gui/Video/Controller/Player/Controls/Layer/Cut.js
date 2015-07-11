Gui.Video.Controller.Player.Controls.Layer.Cut = function () {};

Gui.Video.Controller.Player.Controls.Layer.Cut.prototype = new Gui.Video.Controller.Player.Controls.Layer();

/**
 * initialize
 */
Gui.Video.Controller.Player.Controls.Layer.Cut.prototype.init = function () {

    Gui.Video.Controller.Player.Controls.Layer.prototype.init.call(this);

    this.triggerMoveMarkForward = this.module.getController(
        'Player.Controls.Trigger.MoveMarkForward',
        {
            "parent" : this.data.parent.view,
            "handler" : this.moveMark.bind(this, 'forward')
        }
    );

    this.triggerMoveMarkBackward = this.module.getController(
        'Player.Controls.Trigger.MoveMarkBackward',
        {
            "parent" : this.data.parent.view,
            "handler" : this.moveMark.bind(this, 'backward')
        }
    );

    this.triggerMinuteForward = this.module.getController(
        'Player.Controls.Trigger.MarkMinuteForward',
        {
            "parent" : this.data.parent.view,
            "handler" : this.moveBySeconds.bind(this, 'forward')
        }
    );

    this.triggerMinuteBackward = this.module.getController(
        'Player.Controls.Trigger.MarkMinuteBackward',
        {
            "parent" : this.data.parent.view,
            "handler" : this.moveBySeconds.bind(this, 'backward')
        }
    );

    this.triggerCut = this.module.getController(
        'Player.Controls.Trigger.Cut',
        {
            "parent" : this.data.parent.view,
            "handler" : this.doCut.bind(this)
        }
    );

    this.triggerWatch = this.module.getController(
        'Player.Controls.Trigger.Watch',
        {
            "parent" : this.data.parent.view,
            "handler" : this.watch.bind(this)
        }
    );
};

/**
 * dispatch view
 */
Gui.Video.Controller.Player.Controls.Layer.Cut.prototype.dispatchView = function () {

    this.triggerMoveMarkForward.dispatchView();
    this.triggerMoveMarkBackward.dispatchView();
    this.triggerMinuteForward.dispatchView();
    this.triggerMinuteBackward.dispatchView();
    this.triggerCut.dispatchView();
    this.triggerWatch.dispatchView();
    Gui.Video.Controller.Player.Controls.Layer.prototype.dispatchView.call(this);
};

/**
 * trigger cutting
 */
Gui.Video.Controller.Player.Controls.Layer.Cut.prototype.doCut = function () {

    var recording = this.player.data.sourceModel;

    $window.one('gui-recording.cutting-marks-invalid.' + recording.eventKey, function () {

        $.event.trigger({
            "type": "window.request",
            "payload": {
                "type": "Notification",
                "data": {
                    "text" : 'Cutting marks invalid',
                    "error" : true
                }
            }
        });
    }.bind(this));

    $window.one('gui-recording.cutter-start-failed.' + recording.eventKey, function () {

        $.event.trigger({
            "type": "window.request",
            "payload": {
                "type": "Notification",
                "data": {
                    "text" : 'Failed starting cut process',
                    "error" : true
                }
            }
        });
    }.bind(this));

    $window.one('vdrest-api-actions.cutter-started.' + recording.eventKey, function () {

        $.event.trigger({
            "type": "window.request",
            "payload": {
                "type": "Notification",
                "data": {
                    "text" : 'Edit recording started'
                }
            }
        });
    }.bind(this));

    $window.one('gui-recording.cut.' + recording.eventKey, function () {

        $.event.trigger({
            "type": "window.request",
            "payload": {
                "type": "Notification",
                "data": {
                    "text" : 'Edit recording ready'
                }
            }
        });
    }.bind(this));

    $window.one('gui-recording.cutting-marks-saved.' + recording.eventKey, function () {

        recording.cut();
    }.bind(this));

    recording.saveCuttingMarks();
};

/**
 * trigger jump to mark
 * @param {string} dir
 */
Gui.Video.Controller.Player.Controls.Layer.Cut.prototype.jumpMark = function (dir) {

    this.osd.timeLine.jumpMark(dir);
};

/**
 * trigger move mark forward
 * @param {string} dir
 */
Gui.Video.Controller.Player.Controls.Layer.Cut.prototype.moveMark = function (dir) {

    var index = this.osd.timeLine.data.activeMark,
        frames = this.osd.timeLine.fineSteps[this.osd.timeLine.selectedFineStep].frames;

    if ('forward' !== dir) {
        frames *= -1;
    }

    this.osd.timeLine.moveMark(index, frames);
};

/**
 * move mark a minute forward
 * @param {string} dir
 */
Gui.Video.Controller.Player.Controls.Layer.Cut.prototype.moveBySeconds = function (dir) {

    var index = this.osd.timeLine.data.activeMark,
        frames = this.osd.timeLine.steps[this.osd.timeLine.selectedStep].seconds
            * this.player.data.sourceModel.data.frames_per_second;


    if ('forward' !== dir) {
        frames *= -1;
    }

    this.osd.timeLine.moveMark(index, frames);
};

/**
 * watch mark
 */
Gui.Video.Controller.Player.Controls.Layer.Cut.prototype.watch = function () {

    this.osd.timeLine.watchMark();
};

/**
 * destruct view
 */
Gui.Video.Controller.Player.Controls.Layer.Cut.prototype.destructView = function () {

    this.triggerMoveMarkForward.destructView();
    this.triggerMoveMarkBackward.destructView();
    this.triggerMinuteForward.destructView();
    this.triggerMinuteBackward.destructView();
    this.triggerCut.destructView();
    this.triggerWatch.destructView();
    Gui.Video.Controller.Player.Controls.Layer.prototype.destructView.call(this);
};