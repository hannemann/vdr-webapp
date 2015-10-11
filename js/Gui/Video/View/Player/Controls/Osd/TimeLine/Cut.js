Gui.Video.View.Player.Controls.Osd.TimeLine.Cut = function () {};

Gui.Video.View.Player.Controls.Osd.TimeLine.Cut.prototype = new Gui.Video.View.Player.Controls.Osd.TimeLine.Video();

Gui.Video.View.Player.Controls.Osd.TimeLine.Cut.prototype.render = function () {

    Gui.Video.View.Player.Controls.Osd.TimeLine.Video.prototype.render.call(this);
    this.addTrigger()
        .addButtons();
};

Gui.Video.View.Player.Controls.Osd.TimeLine.Cut.prototype.addButtons = function () {

    var wrapper = $('<div class="mark-controls-wrapper info">').prependTo(this.player.controls.layer.osd.view.node),
        fineStepSettings = $('<div class="mark-controls">').appendTo(wrapper),
        markControls = $('<div class="mark-controls">').appendTo(wrapper),
        stepSettings = $('<div class="mark-controls">').appendTo(wrapper);

    this.togglePrevMark = $('<div class="vdr-web-symbol timeline-control">').text('G').appendTo(markControls);
    this.toggleNextMark = $('<div class="vdr-web-symbol timeline-control">').text('E').appendTo(markControls);
    this.addMark = $('<div class="vdr-web-symbol timeline-control">').text('+').appendTo(markControls);
    this.removeMark = $('<div class="vdr-web-symbol timeline-control">').text('-').appendTo(markControls);

    this.fineStepSettingsDecrease = $('<div class="vdr-web-symbol timeline-control">').text('-').appendTo(fineStepSettings);
    this.fineStepSettingsIndicator = $('<div class="timeline-control">').appendTo(fineStepSettings);
    this.fineStepSettingsIncrease = $('<div class="vdr-web-symbol timeline-control">').text('+').appendTo(fineStepSettings);

    this.stepSettingsDecrease = $('<div class="vdr-web-symbol timeline-control">').text('-').appendTo(stepSettings);
    this.stepSettingsIndicator = $('<div class="timeline-control">').appendTo(stepSettings);
    this.stepSettingsIncrease = $('<div class="vdr-web-symbol timeline-control">').text('+').appendTo(stepSettings);
};
