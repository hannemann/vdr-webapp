Gui.Video.Controller.Player.Controls.Layer.Watch = function () {};

Gui.Video.Controller.Player.Controls.Layer.Watch.prototype = new Gui.Video.Controller.Player.Controls.Layer();

/**
 * initialize
 */
Gui.Video.Controller.Player.Controls.Layer.Watch.prototype.init = function () {

    Gui.Video.Controller.Player.Controls.Layer.prototype.init.call(this);

    this.volumeCtrl = this.module.getController('Player.Controls.Volume', {
        "parent" : this.data.parent,
        "player" : this.player
    });

    this.triggerStop = this.module.getController(
        'Player.Controls.Trigger.Stop',
        {
            "parent" : this.data.parent.view,
            "handler" : this.player.stopPlayback.bind(this.player)
        }
    );

    this.triggerFullScreen = this.module.getController(
        'Player.Controls.Trigger.ToggleFullScreen',
        {
            "parent" : this.data.parent.view,
            "handler" : this.player.toggleFullScreen.bind(this.player)
        }
    );

    this.triggerToggleMinimize = this.module.getController(
        'Player.Controls.Trigger.Minimize',
        {
            "parent" : this.data.parent.view,
            "handler" : this.player.toggleMinimize.bind(this.player)
        }
    );

    this.triggerQualitySelect = this.module.getController(
        'Player.Controls.Trigger.Quality',
        {
            "parent" : this.data.parent.view,
            "handler" : this.toggleQualitySelector.bind(this)
        }
    );
};

/**
 * dispatch view
 */
Gui.Video.Controller.Player.Controls.Layer.Watch.prototype.dispatchView = function () {

    Gui.Video.Controller.Player.Controls.Layer.prototype.dispatchView.call(this);
    this.triggerFullScreen.dispatchView();
    this.triggerToggleMinimize.dispatchView();
    this.volumeCtrl.dispatchView();
    this.triggerQualitySelect.dispatchView();
    this.triggerStop.dispatchView();
};

/**
 * toggle quality selector
 */
Gui.Video.Controller.Player.Controls.Layer.Watch.prototype.toggleQualitySelector = function () {

    if (!this.qualitySelector) {
        this.showQualitySelector();
    } else {
        this.hideQualitySelector();
    }
};

/**
 * hide quality selector
 */
Gui.Video.Controller.Player.Controls.Layer.Watch.prototype.showQualitySelector = function () {

    this.qualitySelector = this.module.getController('Player.Controls.Quality', {"parent" : this.data.parent});
    this.qualitySelector.dispatchView();
};

/**
 * hide quality selector
 */
Gui.Video.Controller.Player.Controls.Layer.Watch.prototype.hideQualitySelector = function () {

    if (this.qualitySelector) {
        this.qualitySelector.destructView();
        delete this.qualitySelector;
        this.player.hideControls(true);
    }
};

/**
 * destruct view
 */
Gui.Video.Controller.Player.Controls.Layer.Watch.prototype.destructView = function () {

    this.triggerFullScreen.destructView();
    this.triggerToggleMinimize.destructView();
    this.volumeCtrl.destructView();
    this.triggerQualitySelect.destructView();
    this.triggerStop.destructView();
    Gui.Video.Controller.Player.Controls.Layer.prototype.destructView.call(this);
};