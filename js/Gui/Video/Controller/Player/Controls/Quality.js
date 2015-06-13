/**
 * @constructor
 */
Gui.Video.Controller.Player.Controls.Quality = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Video.Controller.Player.Controls.Quality.prototype = new VDRest.Abstract.Controller();

/**
 * @type {boolean}
 */
Gui.Video.Controller.Player.Controls.Quality.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Video.Controller.Player.Controls.Quality.prototype.init = function () {

    this.player = this.data.parent.player;

    this.view = this.module.getView('Player.Controls.Quality', {
        "player" : this.player
    });
    this.view.setParentView(this.data.parent.view);
    this.sizeSelect = this.module.getController('Player.Controls.Quality.Size', {
        "parent" : this
    });
    this.bitrateSelect = this.module.getController('Player.Controls.Quality.Bitrate', {
        "parent" : this
    });
};

/**
 * dispatch view
 */
Gui.Video.Controller.Player.Controls.Quality.prototype.dispatchView = function () {

    this.sizeSelect.dispatchView();
    this.bitrateSelect.dispatchView();
    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.sizeSelect.view.scrollToSelected();
    this.bitrateSelect.view.scrollToSelected();
};

/**
 * dispatch view
 */
Gui.Video.Controller.Player.Controls.Quality.prototype.destructView = function () {

    this.view.node.one(this.transitionEndEvents, function () {
        this.sizeSelect.destructView();
        delete this.sizeSelect;
        this.bitrateSelect.destructView();
        delete this.bitrateSelect;
        VDRest.Abstract.Controller.prototype.destructView.call(this);
    }.bind(this));
    this.view.node.removeClass('show');
};
