/**
 * @class
 * @constructor
 */
Gui.Tabs.Controller.Abstract = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Tabs.Controller.Abstract.prototype = new VDRest.Abstract.Controller();

/**
 * initialize
 */
Gui.Tabs.Controller.Abstract.prototype.init = function () {

    this.view = this.module.getView('Abstract', this.data);

    this.addObserver();
};
/**
 * dispatch
 */
Gui.Tabs.Controller.Abstract.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    this.addDomEvents();
};

/**
 * add event handler
 */
Gui.Tabs.Controller.Abstract.prototype.addObserver = function () {

    $document.on("destruct.window-" + this.keyInCache, this.destruct.bind(this));

    $document.on('gui.tabs.update-' + this.keyInCache, this.update.bind(this));
};

/**
 * remove event handler
 */
Gui.Tabs.Controller.Abstract.prototype.removeObserver = function () {

    $document.off("destruct.window-" + this.keyInCache, this.destruct.bind(this));

    $document.off('gui.tabs.update-' + this.keyInCache, this.update.bind(this));
};

/**
 * call update method
 */
Gui.Tabs.Controller.Abstract.prototype.update = function (e) {

    var method = e.payload.method, args = e.payload.args;

    if ("function" === typeof this[method]) {

        this[method].apply(this, args);
    }
};

/**
 * update cache
 */
Gui.Tabs.Controller.Abstract.prototype.updateCacheKey = function (keyInCache) {

    this.removeObserver();
    this.module.cache.updateKeys(this, keyInCache);
    this.addObserver();
};

/**
 * add events
 */
Gui.Tabs.Controller.Abstract.prototype.addDomEvents = function () {

    this.view.tabs.find('li').on('click', this.handleClick.bind(this));
};

Gui.Tabs.Controller.Abstract.prototype.handleClick = function (e) {

    this.vibrate();

    e.preventDefault();
    if (!$(e.target).hasClass('current')) {

        this.view.setCurrent($(e.target).attr('data-index'));
    }
};

/**
 * destruct view, remove from cache
 */
Gui.Tabs.Controller.Abstract.prototype.destruct = function () {

    this.view.tabs.find('li').off('click');
    this.view.destruct();
    this.module.cache.flushByClassKey(this);
    this.removeObserver();
};
