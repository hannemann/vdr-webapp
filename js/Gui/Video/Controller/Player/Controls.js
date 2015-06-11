/**
 * @constructor
 */
Gui.Video.Controller.Player.Controls = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Video.Controller.Player.Controls.prototype = new VDRest.Abstract.Controller();

/**
 * initialize
 */
Gui.Video.Controller.Player.Controls.prototype.init = function () {

    this.player = this.data.parent;

    this.view = this.module.getView('Player.Controls', {
        "player" : this.player
    });
    this.view.setParentView(this.player.view);
    this.isHidden = false;

    this.triggerPlay = this.module.getController(
        'Player.Controls.Trigger.Play',
        {
            "parent" : this.view,
            "handler" : this.player.togglePlayback.bind(this.player)
        }
    );

    this.triggerStop = this.module.getController(
        'Player.Controls.Trigger.Stop',
        {
            "parent" : this.view,
            "handler" : this.player.stopPlayback.bind(this.player)
        }
    );

    this.triggerFullScreen = this.module.getController(
        'Player.Controls.Trigger.ToggleFullScreen',
        {
            "parent" : this.view,
            "handler" : this.player.toggleFullScreen.bind(this.player)
        }
    );
};

/**
 * dispatch view
 */
Gui.Video.Controller.Player.Controls.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    this.triggerPlay.dispatchView();
    this.triggerStop.dispatchView();
    this.triggerFullScreen.dispatchView();
    this.addObserver()
};

/**
 * add event listeners
 */
Gui.Video.Controller.Player.Controls.prototype.addObserver = function () {

    this.view.node.on('click.' + this.player.keyInCache, this.player.toggleControls.bind(this.player));
    this.view.ctrlQuality.on('click.' + this.player.keyInCache, this.player.toggleQuality.bind(this.player));
    this.view.ctrlMinimize.on('click.' + this.player.keyInCache, this.player.toggleMinimize.bind(this.player));

    if (this.player.data.isTv) {
        this.addZappObserver();
    } else {
        this.addDownloadObserver();
        this.addCutObserver();
    }
};

/**
 * add event listeners for zapping
 */
Gui.Video.Controller.Player.Controls.prototype.addZappObserver = function () {

    this.view.ctrlChannelUp.on('click.' + this.player.keyInCache, this.player.changeSrc.bind(this.player));
    this.view.ctrlChannelDown.on('click.' + this.player.keyInCache, this.player.changeSrc.bind(this.player));
};

/**
 * add event listeners for zapping
 */
Gui.Video.Controller.Player.Controls.prototype.addCutObserver = function () {

    this.view.ctrlCut.on('click.' + this.player.keyInCache, this.player.startCutting.bind(this.player));
};

/**
 * add download event listener
 */
Gui.Video.Controller.Player.Controls.prototype.addDownloadObserver = function () {

    if ("undefined" !== typeof this.view.ctrlDownload) {
        this.view.ctrlDownload.on('click', this.startDownload.bind(this));
    }
};

/**
 * remove event listeners
 */
Gui.Video.Controller.Player.Controls.prototype.removeObserver = function () {

    this.view.node.off('click');
    this.view.ctrlQuality.off('click');
    this.view.ctrlMinimize.off('click');
    this.removeZappObserver();
    this.removeDownloadObserver();
    this.removeCutObserver();
};

/**
 * remove event listeners for zapping
 */
Gui.Video.Controller.Player.Controls.prototype.removeZappObserver = function () {

    if ("undefined" !== typeof this.view.ctrlChannelUp) {
        this.view.ctrlChannelUp.off('click');
        this.view.ctrlChannelDown.off('click');
    }
};

/**
 * remove event listeners for zapping
 */
Gui.Video.Controller.Player.Controls.prototype.removeCutObserver = function () {

    if ("undefined" !== typeof this.view.ctrlCut) {
        this.view.ctrlCut.off('click');
    }
};

/**
 * remove osd related event listeners
 */
Gui.Video.Controller.Player.Controls.prototype.removeDownloadObserver = function () {

    if ("undefined" !== typeof this.view.ctrlDownload) {
        this.view.ctrlDownload.off('click');
    }
};

/**
 * show controls overlay
 */
Gui.Video.Controller.Player.Controls.prototype.toggle = function (e) {

    if (this.omitToggleControls) {
        this.omitToggleControls = undefined;
        return;
    }

    if (e instanceof jQuery.Event) {
        e.stopPropagation();
    }
    this.stopHide();

    if (this.view.node.hasClass('show')) {
        this.view.node.removeClass('show');
        this.isHidden = true;
        //this.qualitySelect.removeClass('show');
    } else {

        this.view.node.addClass('show');
        this.isHidden = false;
        //this.scrollTitle();
        if (!e) {
            this.deferHide();
        }
    }
};

/**
 * defer hiding controls
 */
Gui.Video.Controller.Player.Controls.prototype.deferHide = function () {

    this.controlsTimeout = setTimeout(function () {
        this.view.node.removeClass('show');
        //me.qualitySelect.removeClass('show');
    }.bind(this), 5000);
};

/**
 * stop hiding controls
 */
Gui.Video.Controller.Player.Controls.prototype.stopHide = function () {

    if ("undefined" !== typeof this.controlsTimeout) {
        clearTimeout(this.controlsTimeout);
        this.controlsTimeout = undefined;
    }
};

/**
 * remove recording related elements
 * add tv related elements
 * @return {Gui.Video.Controller.Player.Controls}
 */
Gui.Video.Controller.Player.Controls.prototype.setIsTv = function () {

    this.removeDownloadObserver();
    this.view.removeDownloadButton();
    this.view.addChannelButtons();
    this.removeZappObserver();
    this.addZappObserver();

    return this;
};

/**
 * remove rv related elements
 * add recording related elements
 * @return {Gui.Video.Controller.Player.Controls}
 */
Gui.Video.Controller.Player.Controls.prototype.setIsVideo = function () {

    this.removeZappObserver();
    this.view.removeChannelButtons();
    this.view.addDownloadButton();
    this.removeDownloadObserver();
    this.addDownloadObserver();

    return this;
};

/**
 * destruct view
 */
Gui.Video.Controller.Player.Controls.prototype.destructView = function () {

    this.stopHide();
    this.triggerPlay.destructView();
    this.triggerStop.destructView();
    this.triggerFullScreen.destructView();
    VDRest.Abstract.Controller.prototype.destructView.call(this);
};
