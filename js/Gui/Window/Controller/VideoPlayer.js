/**
 * @class
 * @constructor
 */
Gui.Window.Controller.VideoPlayer = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.Controller.VideoPlayer.prototype = new Gui.Window.Controller.Abstract();

/**
 * @type {string}
 */
Gui.Window.Controller.VideoPlayer.prototype.cacheKey = 'url';

/**
 * initialize view
 */
Gui.Window.Controller.VideoPlayer.prototype.init = function () {

    this.eventPrefix = 'window.videoplayer';

    this.view = this.module.getView('VideoPlayer', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);

    this.view.setParentView({
        "node" : $('body')
    });

    this.addObserver();
};

/**
 * add event listeners
 */
Gui.Window.Controller.VideoPlayer.prototype.addObserver = function () {

    $(window).on('orientationchange.'+this.keyInCache, $.proxy(this.view.setPosition, this.view));
};

/**
 * add event listeners
 */
Gui.Window.Controller.VideoPlayer.prototype.removeObserver = function () {

    $(window).on('orientationchange.'+this.keyInCache);
};

/**
 * destroy
 */
Gui.Window.Controller.VideoPlayer.prototype.destructView = function () {

    Gui.Window.Controller.Abstract.prototype.destructView.call(this);
    this.module.cache.invalidateAllTypes(this);
};