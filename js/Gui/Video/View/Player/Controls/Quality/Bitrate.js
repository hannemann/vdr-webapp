Gui.Video.View.Player.Controls.Quality.Bitrate = function () {};

Gui.Video.View.Player.Controls.Quality.Bitrate.prototype = new Gui.Video.View.Player.Controls.Quality.Abstract();

/**
 * @type {boolean}
 */
Gui.Video.View.Player.Controls.Quality.Bitrate.prototype.bypassCache = true;

/**
 * @type {string[]}
 */
Gui.Video.View.Player.Controls.Quality.Bitrate.prototype.options = [
    '2048K', '1536K', '1024K', '768K', '512K', '256K', '128K', '96K', '64K'
];

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.Quality.Bitrate.prototype.className = 'bitrate';

/**
 * @param {string} value
 * @return {boolean}
 */
Gui.Video.View.Player.Controls.Quality.Bitrate.prototype.selected = function (value) {

    return value == this.data.selected;
};
