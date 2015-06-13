/**
 * @constructor
 */
Gui.Video.Controller.Player.Controls.Quality.Size = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Video.Controller.Player.Controls.Quality.Size.prototype = new Gui.Video.Controller.Player.Controls.Quality.Abstract();

/**
 * @type {boolean}
 */
Gui.Video.Controller.Player.Controls.Quality.Size.prototype.bypassCache = true;

/**
 * @type {string}
 */
Gui.Video.Controller.Player.Controls.Quality.Size.prototype.type = 'Size';
