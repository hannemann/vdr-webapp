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
            "handler" : this.toggleQualitySelector.bind(this)
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
 * toggle quality selector
 */
Gui.Video.Controller.Player.Controls.Layer.prototype.toggleQualitySelector = function () {

    this.data.parent.omitDestruct = true;
    if (!this.qualitySelector) {
        this.showQualitySelector();
    } else {
        this.hideQualitySelector();
    }
};

/**
 * hide quality selector
 */
Gui.Video.Controller.Player.Controls.Layer.prototype.showQualitySelector = function () {

    this.qualitySelector = this.module.getController('Player.Controls.Quality', {"parent" : this.data.parent});
    this.qualitySelector.dispatchView();
};

/**
 * hide quality selector
 */
Gui.Video.Controller.Player.Controls.Layer.prototype.hideQualitySelector = function () {

    if (this.qualitySelector) {
        this.qualitySelector.destructView();
        delete this.qualitySelector;
    }
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
