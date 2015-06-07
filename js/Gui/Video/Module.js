/**
 * Timer Module
 * @constructor
 */
Gui.Video = function () {
};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
Gui.Video.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
Gui.Video.prototype.namespace = 'Gui';

/**
 * Module name
 * @type {string}
 */
Gui.Video.prototype.name = 'Video';

/**
 * store video player if exists
 * @type {boolean|Gui.Window.Controller.Player}
 */
Gui.Video.prototype.videoPlayer = false;

/**
 * determine if vdeoplayer winow exists
 * @returns {boolean}
 */
Gui.Video.prototype.hasVideoPlayer = function () {

    return !!this.videoPlayer;
};

/**
 * store instance of video player
 * @param {Gui.Window.Controller.Player} controller
 */
Gui.Video.prototype.setVideoPlayer = function (controller) {

    if (controller && controller instanceof Gui.Video.Controller.Player) {
        this.videoPlayer = controller;
    } else {
        this.videoPlayer = false;
    }

};

Gui.Video.prototype.getVideoPlayer = function () {

    return this.videoPlayer;
};

/**
 * delete videoplayer
 */
Gui.Video.prototype.unsetVideoPlayer = function () {
    this.videoPlayer = false;
};

/**
 * dispatch default view
 */
Gui.Video.prototype.dispatch = function () {

    this.store = this.getStore();
    this.getController('Player').dispatchView();
};

/**
 * dispatch default view
 */
Gui.Video.prototype.destruct = function () {

    this.getController('Player').destructView();
    this.cache.flush();
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Video', true);