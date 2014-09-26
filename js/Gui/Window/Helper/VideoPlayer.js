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

    c.width = video.offsetWidth;
    c.height = video.offsetHeight;

    ctx.drawImage(video, 0, 0, video.offsetWidth, video.offsetHeight);


    return c.toDataURL();
};

Gui.Window.Helper.VideoPlayer.prototype.defaultPoster = function (video) {

    var c = document.createElement('canvas'),
        ctx = c.getContext('2d'), i = new Image();

    c.width = video.offsetWidth;
    c.height = video.offsetHeight;

    i.src = VDRest.image.getIcon();

    ctx.globalAlpha = 0.2;
    ctx.drawImage(
        i,
        parseInt((c.width - i.width) / 2, 10),
        parseInt((c.height - i.height) / 2, 10)
    );

    return c.toDataURL();
};