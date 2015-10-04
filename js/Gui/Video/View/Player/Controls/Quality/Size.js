Gui.Video.View.Player.Controls.Quality.Size = function () {};

Gui.Video.View.Player.Controls.Quality.Size.prototype = new Gui.Video.View.Player.Controls.Quality.Abstract();

/**
 * @type {boolean}
 */
Gui.Video.View.Player.Controls.Quality.Size.prototype.bypassCache = true;

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.Quality.Size.prototype.options =
    ["HD1080", "HD720", "SD", "768x432", "640x360", "480x270", "320x180"];

/**
 * @type {Object.<string, {width: number, height: number}>}
 */
Gui.Video.View.Player.Controls.Quality.Size.prototype.values = {
    "HD1080" : {
        "width" : 1920,
        "height" : 1080
    },
    "HD720" : {
        "width" : 1280,
        "height" : 720
    },
    "SD" : {
        "width" : 1024,
        "height" : 576
    },
    "768x432" : {
        "width" : 768,
        "height" : 432
    },
    "640x360" : {
        "width" : 640,
        "height" : 360
    },
    "480x270" : {
        "width" : 480,
        "height" : 270
    },
    "320x180" : {
        "width" : 320,
        "height" : 180
    }
};

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.Quality.Size.prototype.className = 'size';
