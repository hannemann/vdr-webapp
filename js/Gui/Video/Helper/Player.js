/**
 * @class
 * @constructor
 */
Gui.Video.Helper.Player = function () {
};

/**
 * @type {VDRest.Abstract.Helper}
 */
Gui.Video.Helper.Player.prototype = new VDRest.Abstract.Helper();

/**
 * capture current frame from video tag
 * @param {HTMLVideoElement} video
 * @returns {string}
 */
Gui.Video.Helper.Player.prototype.captureFrame = function (video) {

    var c = document.createElement('canvas'),
        ctx = c.getContext('2d');

    c.width = video.offsetWidth;
    c.height = video.offsetHeight;

    ctx.drawImage(video, 0, 0, video.offsetWidth, video.offsetHeight);


    return c.toDataURL();
};

/**
 * set Poster with app icon
 * @param video
 * @returns {string}
 */
Gui.Video.Helper.Player.prototype.defaultPoster = function (video) {

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

/**
 * retrieve frame from externremux and set it as poster
 * @param {{
 *      width: int,
 *      height: int,
 *      video: HTMLVideoElement,
 *      sourceModel: VDRest.Recordings.Model.List.Recording|VDRest.Epg.Model.Channels.Channel,
 *      [startTime]: int,
 *      poster: HTMLImageElement,
 *      [mark]: number
 *  }} options
 */
Gui.Video.Helper.Player.prototype.setVideoPoster = function (options) {

    var d = new Date().getTime(), streamdevParams = [], offsetParam = '?pos=';

    streamdevParams.push('WIDTH=' + options.width);
    streamdevParams.push('HEIGHT=' + options.height);
    streamdevParams.push('TYPE=poster');

    if ("undefined" === typeof options.mark) {
        offsetParam += 'time.' + options.startTime;
    } else {
        offsetParam += 'mark.' + options.mark;
    }

    options.poster.src = options.sourceModel
        .getStreamUrl(streamdevParams)
            + offsetParam + '&d=' + d;
};
