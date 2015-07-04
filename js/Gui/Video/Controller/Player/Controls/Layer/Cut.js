Gui.Video.Controller.Player.Controls.Layer.Cut = function () {};

Gui.Video.Controller.Player.Controls.Layer.Cut.prototype = new Gui.Video.Controller.Player.Controls.Layer();

/**
 * initialize
 */
Gui.Video.Controller.Player.Controls.Layer.Cut.prototype.init = function () {

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
Gui.Video.Controller.Player.Controls.Layer.Cut.prototype.dispatchView = function () {

    Gui.Video.Controller.Player.Controls.Layer.prototype.dispatchView.call(this);
};

/**
 * destruct view
 */
Gui.Video.Controller.Player.Controls.Layer.Cut.prototype.destructView = function () {

    Gui.Video.Controller.Player.Controls.Layer.prototype.destructView.call(this);
};