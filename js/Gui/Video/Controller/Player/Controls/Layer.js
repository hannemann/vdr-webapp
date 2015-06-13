Gui.Video.Controller.Player.Controls.Layer = function () {};

Gui.Video.Controller.Player.Controls.Layer.prototype = new Gui.Video.Controller.Player.Controls.Abstract();

/**
 * initialize
 */
Gui.Video.Controller.Player.Controls.Layer.prototype.init = function () {

    this.player = this.data.parent.player;

    this.osd = this.module.getController('Player.Controls.Osd', {"parent" : this.data.parent});

    this.volumeCtrl = this.module.getController('Player.Controls.Volume', {
        "parent" : this.data.parent,
        "player" : this.player
    });

    this.triggerPlay = this.module.getController(
        'Player.Controls.Trigger.Play',
        {
            "parent" : this.data.parent.view,
            "handler" : this.player.togglePlayback.bind(this.player)
        }
    );

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
            "handler" : this.player.toggleQuality.bind(this.player)
        }
    );
};

/**
 * dispatch view
 */
Gui.Video.Controller.Player.Controls.Layer.prototype.dispatchView = function () {

    this.osd.dispatchView();
    this.volumeCtrl.dispatchView();
    this.triggerPlay.dispatchView();
    this.triggerStop.dispatchView();
    this.triggerFullScreen.dispatchView();
    this.triggerToggleMinimize.dispatchView();
    this.triggerQualitySelect.dispatchView();
};

/**
 * destruct view
 */
Gui.Video.Controller.Player.Controls.Layer.prototype.destructView = function () {

    this.osd.destructView();
    this.volumeCtrl.destructView();
    this.triggerPlay.destructView();
    this.triggerStop.destructView();
    this.triggerFullScreen.destructView();
    this.triggerToggleMinimize.destructView();
    this.triggerQualitySelect.destructView();
};
