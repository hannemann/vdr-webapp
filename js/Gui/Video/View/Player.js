/**
 * @class
 * @constructor
 * @property {HTMLImageElement} poster
 */
Gui.Video.View.Player = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Video.View.Player.prototype = new Gui.Window.View.Abstract();

/**
 * @type {boolean}
 */
Gui.Video.View.Player.prototype.bypassCache = true;

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Video.View.Player.prototype.isModal = true;

/**
 * @type {boolean}
 */
Gui.Video.View.Player.prototype.isModalOpaque = true;

/**
 * @type {boolean}
 */
Gui.Video.View.Player.prototype.modalExtraClasses = "modal-video";

/**
 * initialize video node
 */
Gui.Video.View.Player.prototype.init = function () {

    this.node = $('<div class="video-player-wrapper">');
    this.poster = new Image();
    this.poster.classList.add('poster');
    this.node[0].appendChild(this.poster);
    this.defaultTitle = $('title').text();
    $('body').addClass('has-video-player');
};

/**
 * decorate and render
 */
Gui.Video.View.Player.prototype.render = function () {

    this.addClasses();

    Gui.Window.View.Abstract.prototype.render.call(this);
};

/**
 * add classes
 * @returns {Gui.Video.View.Player}
 */
Gui.Video.View.Player.prototype.addClasses = function () {

    var classNames = ['html5-player', 'fullsize'];

    this.node.addClass(classNames.join(' '));

    return this;
};

/**
 * destroy window
 */
Gui.Video.View.Player.prototype.destruct = function () {

    Gui.Window.View.Abstract.prototype.destruct.call(this);
    $('body').removeClass('has-video-player');
    $('title').text(this.defaultTitle);
};