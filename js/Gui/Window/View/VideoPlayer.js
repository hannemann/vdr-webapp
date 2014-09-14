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

    //this.node = $('<video preload="none" controls>');
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

    var me = this, d = new Date();

    //type = type || 'video/webm';


    //var s = $('<source type="' + type + '" src="' + src + '">');
    //var s = $('<source src="' + src + '">');
    //
    //s.appendTo(this.node);


    src += (src.indexOf('?') > -1 ? '&' : '?') + 'd=' + d.getTime() + d.getMilliseconds();
    me.node.prop('src', src);

    //this.node.one('click', function () {
    //    src += (src.indexOf('?') > -1 ? '&' : '?') + 'd=' + new Date().getTime();
    //    me.node.prop('src', src);
    //    me.node.get(0).play();
    //});
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

    var me = this, v = this.node.get(0);
    // apply animation
//    this.node.toggleClass('collapse expand');
//    // remove on animation end
//    this.node.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
//
//        Gui.Window.View.Abstract.prototype.destruct.call(me);
//    });

    v.pause();
    //v.src = "";
    this.node.prop('src', false);

    Gui.Window.View.Abstract.prototype.destruct.call(me);
};