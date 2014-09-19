/**
 * @class
 * @constructor
 */
Gui.Window.View.VideoPlayer = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.VideoPlayer.prototype = new Gui.Window.View.Abstract();

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.VideoPlayer.prototype.isModal = true;

/**
 * @type {boolean}
 */
Gui.Window.View.VideoPlayer.prototype.isModalOpaque = true;

/**
 * @type {string}
 */
Gui.Window.View.VideoPlayer.prototype.cacheKey = 'url';

/**
 * initialize video node
 */
Gui.Window.View.VideoPlayer.prototype.init = function () {

    this.node = $('<div class="video-player-wrapper">');
    this.player = $('<video preload="none" class="normal-size">');
    this.controls = $('<div class="html5-player-controls show">');

    this.initPlayer();
};

/**
 * decorate and render
 */
Gui.Window.View.VideoPlayer.prototype.render = function () {

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.addClasses();

    this.setPosition();

    this.node.toggleClass('collapsed expand');
};

Gui.Window.View.VideoPlayer.prototype.initPlayer = function () {

    this.player.appendTo(this.node);
    this.addControls();

    return this;
};

/**
 * add control elements
 */
Gui.Window.View.VideoPlayer.prototype.addControls = function () {

    this.addControlButtons();
    this.controls.appendTo(this.node);

    return this;
};

/**
 * add control buttons to overlay
 */
Gui.Window.View.VideoPlayer.prototype.addControlButtons = function () {

    this.ctrlPlay = $('<div class="play">').appendTo(this.controls);

    this.ctrlStop = $('<div class="stop">').appendTo(this.controls);

    this.ctrlFullScreen = $('<div class="toggle-fullScreen">').appendTo(this.controls);
};

/**
 * show controls overlay
 */
Gui.Window.View.VideoPlayer.prototype.toggleControls = function () {

    this.controls.toggleClass('show hide');
};

/**
 * add classes
 * @returns {Gui.Window.View.VideoPlayer}
 */
Gui.Window.View.VideoPlayer.prototype.addClasses = function () {

    var classNames = ['html5-player', 'fullsize', 'collapsed'];

    classNames.push(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');

    this.node.addClass(classNames.join(' '));

    return this;
};

Gui.Window.View.VideoPlayer.prototype.setPosition = function () {

    var me = this;

    setTimeout(function () {
        if (window.innerHeight > window.innerWidth) {
            me.node.removeClass('landscape').addClass('portrait');
        } else {
            me.node.removeClass('portrait').addClass('landscape');
        }
    }, 1000);
};

/**
 * destroy window
 */
Gui.Window.View.VideoPlayer.prototype.destruct = function () {

    var me = this, player = this.player.get(0);

    player.pause();
    this.player.prop('src', false);

    Gui.Window.View.Abstract.prototype.destruct.call(me);
};