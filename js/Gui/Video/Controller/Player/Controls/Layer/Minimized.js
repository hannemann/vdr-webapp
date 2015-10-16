Gui.Video.Controller.Player.Controls.Layer.Minimized = function () {};

Gui.Video.Controller.Player.Controls.Layer.Minimized.prototype = new Gui.Video.Controller.Player.Controls.Layer();

/**
 * initialize
 */
Gui.Video.Controller.Player.Controls.Layer.Minimized.prototype.init = function () {

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

    this.triggerToggleMinimize = this.module.getController(
        'Player.Controls.Trigger.Minimize',
        {
            "parent" : this.data.parent.view,
            "handler" : this.player.toggleMinimize.bind(this.player)
        }
    );
};

/**
 * dispatch view
 */
Gui.Video.Controller.Player.Controls.Layer.Minimized.prototype.dispatchView = function () {

    Gui.Video.Controller.Player.Controls.Layer.prototype.dispatchView.call(this);
    this.triggerStop.dispatchView();
    this.triggerToggleMinimize.dispatchView();
    this.volumeCtrl.dispatchView();
};

/**
 * destruct view
 */
Gui.Video.Controller.Player.Controls.Layer.Minimized.prototype.destructView = function () {

    this.triggerToggleMinimize.destructView();
    this.triggerStop.destructView();
    this.volumeCtrl.destructView();
    Gui.Video.Controller.Player.Controls.Layer.prototype.destructView.call(this);
};
