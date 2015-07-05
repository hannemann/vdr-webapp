Gui.Video.Controller.Player.Controls.Layer = function () {};

Gui.Video.Controller.Player.Controls.Layer.prototype = new VDRest.Abstract.Controller();

/**
 * @type {boolean}
 */
Gui.Video.Controller.Player.Controls.Layer.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Video.Controller.Player.Controls.Layer.prototype.init = function () {

    this.player = this.data.parent.player;

    this.osd = this.module.getController('Player.Controls.Osd', {"parent" : this.data.parent});

    this.triggerPlay = this.module.getController(
        'Player.Controls.Trigger.Play',
        {
            "parent" : this.data.parent.view,
            "handler" : this.player.togglePlayback.bind(this.player)
        }
    );
};

/**
 * dispatch view
 */
Gui.Video.Controller.Player.Controls.Layer.prototype.dispatchView = function () {

    this.osd.dispatchView();
    this.triggerPlay.dispatchView();
};

/**
 * destruct view
 */
Gui.Video.Controller.Player.Controls.Layer.prototype.destructView = function () {

    this.osd.destructView();
    this.triggerPlay.destructView();
};
