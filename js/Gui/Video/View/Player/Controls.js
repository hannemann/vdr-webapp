Gui.Video.View.Player.Controls = function () {};

Gui.Video.View.Player.Controls.prototype = new VDRest.Abstract.View();

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.prototype.symbolPlay = 'C';

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.prototype.symbolPause = 'B';

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.prototype.symbolStop = 'D';

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.prototype.symbolNext = 'S';

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.prototype.symbolPrevious = 'T';

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.prototype.symbolFullscreen = 'Q';

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.prototype.symbolExitFullscreen = 'R';

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.prototype.symbolQuality = 'A';

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.prototype.symbolMinimize = 'O';

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.prototype.symbolMaximize = 'P';

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.prototype.symbolDownload = 'X';

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.prototype.symbolCut = 'Z';

/**
 * initialize
 */
Gui.Video.View.Player.Controls.prototype.init = function () {

    this.node = $('<div class="html5-player-controls show">');
    this.node.attr('data-animate', 'opacity');
};

/**
 * render
 */
Gui.Video.View.Player.Controls.prototype.render = function () {

    this.addControlButtons();

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * add control buttons to overlay
 */
Gui.Video.View.Player.Controls.prototype.addControlButtons = function () {

    this.ctrlQuality = $(
        '<div class="vdr-web-symbol toggle-quality">' + this.symbolQuality + '</div>'
    ).appendTo(this.node);

    if (this.data.isVideo) {
        this.ctrlCut = $(
            '<div class="vdr-web-symbol cut">' + this.symbolCut + '</div>'
        ).appendTo(this.node);
    }

    this.addDownloadButton();
    this.addChannelButtons();

    return this;
};

/**
 * add download button
 */
Gui.Video.View.Player.Controls.prototype.addDownloadButton = function () {

    if (VDRest.config.getItem('streamDownload') && this.data.player.data.isVideo) {
        this.ctrlDownload = $(
            '<div class="vdr-web-symbol download">' + this.symbolDownload + '</div>'
        ).appendTo(this.node);
    }
};

/**
 * remove download button
 */
Gui.Video.View.Player.Controls.prototype.removeDownloadButton = function () {

    if ("undefined" !== typeof this.ctrlDownload) {
        this.ctrlDownload.remove();
        delete this.ctrlDownload;
    }
};

/**
 * add channel buttons
 */
Gui.Video.View.Player.Controls.prototype.addChannelButtons = function () {

    if (this.data.player.data.isTv && !this.ctrlChannelUp) {
        this.ctrlChannelUp = $(
            '<div class="vdr-web-symbol channel-up">' + this.symbolNext + '</div>'
        ).appendTo(this.node);
        this.ctrlChannelDown = $(
            '<div class="vdr-web-symbol channel-down">' + this.symbolPrevious + '</div>'
        ).appendTo(this.node);
    }
};

/**
 * remove channel buttons
 */
Gui.Video.View.Player.Controls.prototype.removeChannelButtons = function () {

    if (this.ctrlChannelUp) {
        this.ctrlChannelUp.remove();
        this.ctrlChannelDown.remove();
        delete this.ctrlChannelUp;
        delete this.ctrlChannelDown;
    }
};

/**
 * destroy nodes
 */
Gui.Video.View.Player.Controls.prototype.destruct = function () {

    this.removeChannelButtons();
    this.removeDownloadButton();

    this.ctrlQuality.remove();
    if ("undefined" !== typeof this.ctrlCut) {
        this.ctrlCut.remove();
        delete this.ctrlCut;
    }

    delete this.ctrlQuality;
};

