Gui.Video.Controller.Player.Controls.Layer.Video = function () {};

Gui.Video.Controller.Player.Controls.Layer.Video.prototype = new Gui.Video.Controller.Player.Controls.Layer();

/**
 * initialize
 */
Gui.Video.Controller.Player.Controls.Layer.Video.prototype.init = function () {

    Gui.Video.Controller.Player.Controls.Layer.prototype.init.call(this);

    this.triggerDownload = this.module.getController(
        'Player.Controls.Trigger.Download',
        {
            "parent" : this.data.parent.view,
            "handler" : this.player.startDownload.bind(this)
        }
    );

    this.triggerCut = this.module.getController(
        'Player.Controls.Trigger.Cut',
        {
            "parent" : this.data.parent.view,
            "handler" : this.player.startCutting.bind(this.player)
        }
    );
};

/**
 * dispatch view
 */
Gui.Video.Controller.Player.Controls.Layer.Video.prototype.dispatchView = function () {

    Gui.Video.Controller.Player.Controls.Layer.prototype.dispatchView.call(this);
    this.triggerDownload.dispatchView();
    this.triggerCut.dispatchView();
};

/**
 * destruct view
 */
Gui.Video.Controller.Player.Controls.Layer.Video.prototype.destructView = function () {

    this.triggerDownload.destructView();
    this.triggerCut.destructView();
    Gui.Video.Controller.Player.Controls.Layer.prototype.destructView.call(this);
};