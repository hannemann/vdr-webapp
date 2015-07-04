Gui.Video.Controller.Player.Controls.Layer.Tv = function () {};

Gui.Video.Controller.Player.Controls.Layer.Tv.prototype = new Gui.Video.Controller.Player.Controls.Layer();

/**
 * initialize
 */
Gui.Video.Controller.Player.Controls.Layer.Tv.prototype.init = function () {

    Gui.Video.Controller.Player.Controls.Layer.prototype.init.call(this);

    this.triggerChannelUp = this.module.getController(
        'Player.Controls.Trigger.ChannelUp',
        {
            "parent" : this.data.parent.view,
            "handler" : this.player.changeSrc.bind(this.player)
        }
    );

    this.triggerChannelDown = this.module.getController(
        'Player.Controls.Trigger.ChannelDown',
        {
            "parent" : this.data.parent.view,
            "handler" : this.player.changeSrc.bind(this.player)
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
};

/**
 * dispatch view
 */
Gui.Video.Controller.Player.Controls.Layer.Tv.prototype.dispatchView = function () {

    Gui.Video.Controller.Player.Controls.Layer.prototype.dispatchView.call(this);
    this.triggerChannelUp.dispatchView();
    this.triggerChannelDown.dispatchView();
    this.triggerFullScreen.dispatchView();
    this.triggerToggleMinimize.dispatchView();
};

/**
 * destruct view
 */
Gui.Video.Controller.Player.Controls.Layer.Tv.prototype.destructView = function () {

    this.triggerChannelUp.destructView();
    this.triggerChannelDown.destructView();
    this.triggerFullScreen.destructView();
    this.triggerToggleMinimize.destructView();
    Gui.Video.Controller.Player.Controls.Layer.prototype.destructView.call(this);
};