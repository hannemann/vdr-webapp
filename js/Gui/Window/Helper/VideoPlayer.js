/**
 * @class
 * @constructor
 */
Gui.Window.Helper.VideoPlayer = function () {};

/**
 * @type {VDRest.Abstract.Helper}
 */
Gui.Window.Helper.VideoPlayer.prototype = new VDRest.Abstract.Helper();

Gui.Window.Helper.VideoPlayer.prototype.captureFrame = function (video) {

    var c = document.createElement('canvas'),
        ctx = c.getContext('2d');

    ctx.drawImage(video, 0, 0, video.offsetWidth, video.offsetHeight);

    return c.toDataURL();
};