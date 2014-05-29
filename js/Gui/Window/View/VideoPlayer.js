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
 * @type {string}
 */
Gui.Window.View.VideoPlayer.prototype.cacheKey = 'url';

/**
 * initialize video node
 */
Gui.Window.View.VideoPlayer.prototype.init = function () {

    this.node = $('<video preload="none" controls>');

};

/**
 * decorate and render
 */
Gui.Window.View.VideoPlayer.prototype.render = function () {

    var me = this;

    this.addClasses();

    Gui.Window.View.Abstract.prototype.render.call(this);

    me.addSource(me.data.url);

    this.node.toggleClass('collapsed expand');
};

/**
 * add source node
 * @param {string} src
 * @param {string} [type]
 */
Gui.Window.View.VideoPlayer.prototype.addSource = function (src, type) {

    type = type || 'video/webm';

        src += (src.indexOf('?') > -1 ? '&' : '?') + 'd=' + new Date().getTime();

    var s = $('<source type="' + type + '" src="' + src + '">');

    s.appendTo(this.node);
};


/**
 * add classes
 * @returns {Gui.Window.View.VideoPlayer}
 */
Gui.Window.View.VideoPlayer.prototype.addClasses = function () {

    var classNames = ['html5-player', 'fullsize', 'collapsed'];

    this.node.addClass(classNames.join(' '));

    return this;
};

/**
 * destroy window
 */
Gui.Window.View.VideoPlayer.prototype.destruct = function () {

    var me = this;
    // apply animation
//    this.node.toggleClass('collapse expand');
//    // remove on animation end
//    this.node.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
//
//        Gui.Window.View.Abstract.prototype.destruct.call(me);
//    });
    Gui.Window.View.Abstract.prototype.destruct.call(me);
};