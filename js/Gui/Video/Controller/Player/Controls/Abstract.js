Gui.Video.Controller.Player.Controls.Abstract = function () {};

Gui.Video.Controller.Player.Controls.Abstract.prototype = new VDRest.Abstract.Controller();

/**
 * @type {boolean}
 */
Gui.Video.Controller.Player.Controls.Abstract.prototype.bypassCache = true;

/**
 * remove recording related elements
 * add tv related elements
 * @return {Gui.Video.Controller.Player.Controls.Abstract}
 */
Gui.Video.Controller.Player.Controls.Abstract.prototype.setIsTv = function () {

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
 * @return {Gui.Video.Controller.Player.Controls.Abstract}
 */
Gui.Video.Controller.Player.Controls.Abstract.prototype.setIsVideo = function () {

    this.removeZappObserver();
    this.view.removeChannelButtons();
    this.view.addDownloadButton();
    this.removeDownloadObserver();
    this.addDownloadObserver();

    return this;
};