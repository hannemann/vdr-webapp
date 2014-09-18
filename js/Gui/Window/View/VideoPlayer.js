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
    this.player = $('<video preload="none" controls>');
    this.controls = $('<div class="html5-player-controls">');
};

/**
 * decorate and render
 */
Gui.Window.View.VideoPlayer.prototype.render = function () {

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.initPlayer().addClasses();

    this.setPosition();

    this.node.toggleClass('collapsed expand');
};

Gui.Window.View.VideoPlayer.prototype.initPlayer = function () {

    this.player.appendTo(this.node);
    this.addSource(this.data.url);
    //this.addControls();

    return this;
};

/**
 * add source node
 * @param {string} src
 * @param {string} [type]
 */
Gui.Window.View.VideoPlayer.prototype.addSource = function (src, type) {

    var me = this, d = new Date();

    //type = type || 'video/webm';


    //var s = $('<source type="' + type + '" src="' + src + '">');
    //var s = $('<source src="' + src + '">');
    //
    //s.appendTo(this.node);


    src += (src.indexOf('?') > -1 ? '&' : '?') + 'd=' + d.getTime() + d.getMilliseconds();
    me.player.prop('src', src);

    //this.node.one('click', function () {
    //    src += (src.indexOf('?') > -1 ? '&' : '?') + 'd=' + new Date().getTime();
    //    me.node.prop('src', src);
    //    me.node.get(0).play();
    //});
    return this;
};

/**
 * add control elements
 */
Gui.Window.View.VideoPlayer.prototype.addControls = function () {

    this.controls.appendTo(this.node);

    return this;
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

        if (window.innerHeight > window.innerWidth) {
            this.node.removeClass('landscape').addClass('portrait');
        } else {
            this.node.removeClass('portrait').addClass('landscape');
        }
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