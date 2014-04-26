/**
 * @class
 * @constructor
 */
Gui.Window.Controller.Broadcast = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.Controller.Broadcast.prototype = new Gui.Window.Controller.Abstract();

/**
 * cache key
 * @type {string}
 */
Gui.Window.Controller.Broadcast.prototype.cacheKey = 'channel/id';

/**
 * initialize view and view model
 */
Gui.Window.Controller.Broadcast.prototype.init = function () {

    this.eventPrefix = 'window.broadcast.' + this.data.channel + '/' + this.data.id;

    this.view = this.module.getView('Broadcast', {
        "id" : this.data.id,
        "channel" : this.data.channel
    });

    Gui.Window.Controller.Abstract.prototype.init.call(this);

    this.module.getViewModel('Broadcast', {
        "id" : this.data.id,
        "channel" : this.data.channel,
        "view" : this.view,
        "resource" : this.data.dataModel
    });

};

/**
 * dispatch
 */
Gui.Window.Controller.Broadcast.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * add event listeners
 */
Gui.Window.Controller.Broadcast.prototype.addObserver = function () {

    if (this.view.hasImages()) {

        this.view.image.on('click', $.proxy(this.animateImageAction, this));
    }

    $(document).on('timer-changed.' + this.keyInCache, $.proxy(this.handleTimerAction, this));

    Gui.Window.Controller.Abstract.prototype.addObserver.call(this);
};
/**
 * add event listeners
 */
Gui.Window.Controller.Broadcast.prototype.removeObserver = function () {

    if (this.view.hasImages()) {

        this.view.image.off('click');
    }
};

Gui.Window.Controller.Broadcast.prototype.animateImageAction = function () {

    this.view.animateImage();
};

Gui.Window.Controller.Broadcast.prototype.handleTimerAction = function () {

    this.view.handleTimerExists(this.data.dataModel.data.timer_exists);
    this.view.handleTimerActive(this.data.dataModel.data.timer_active);
};

/**
 * Destroy
 */
Gui.Window.Controller.Broadcast.prototype.destructView = function () {

    var me = this;
    // apply animation
    this.view.node.toggleClass('collapse expand');
    // remove on animation end
    this.view.node.one(this.animationEndEvents, function () {

        Gui.Window.Controller.Abstract.prototype.destructView.call(me);
    });
};
