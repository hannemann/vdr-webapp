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

    this.handleTimerAction();

    this.addObserver();
};

/**
 * add event listeners
 */
Gui.Window.Controller.Broadcast.prototype.addObserver = function () {

    if (this.view.hasImages()) {

        this.view.image.on('click', $.proxy(this.animateImageAction, this));
    }

    $(document).on('gui.timer-created.' + this.keyInCache, $.proxy(this.handleTimerAction, this));
    $(document).on('gui.timer-updated.' + this.keyInCache, $.proxy(this.handleTimerAction, this));
    $(document).one('gui.timer-deleted.' + this.data.dataModel.data.timer_id, $.proxy(this.handleTimerAction, this));
    this.view.recordButton.on('click', $.proxy(this.toggleTimerAction, this));

    Gui.Window.Controller.Abstract.prototype.addObserver.call(this);
};
/**
 * add event listeners
 */
Gui.Window.Controller.Broadcast.prototype.removeObserver = function () {

    if (this.view.hasImages()) {

        this.view.image.off('click');
    }
    $(document).off('gui.timer-created.' + this.keyInCache, $.proxy(this.handleTimerAction, this));
    $(document).off('gui.timer-updated.' + this.keyInCache, $.proxy(this.handleTimerAction, this));
    $(document).off('gui.timer-deleted.' + this.data.dataModel.data.timer_id, $.proxy(this.handleTimerAction, this));
    this.view.recordButton.off('click', $.proxy(this.toggleTimerAction, this));
};

/**
 * trigger image animation
 */
Gui.Window.Controller.Broadcast.prototype.animateImageAction = function () {

    this.view.animateImage();
};

/**
 * handle timer
 */
Gui.Window.Controller.Broadcast.prototype.handleTimerAction = function () {

    if (this.data.dataModel.data.timer_exists) {

        $(document).one(
            'gui.timer-deleted.' + this.data.dataModel.data.timer_id,
            $.proxy(this.handleTimerAction, this)
        );
    }

    this.view.handleTimerExists(this.data.dataModel.data.timer_exists);
    this.view.handleTimerActive(this.data.dataModel.data.timer_active);
};

/**
 * toggle timer for broadcast
 */
Gui.Window.Controller.Broadcast.prototype.toggleTimerAction = function () {

    var timer = new VDRest.Rest.TimerAdapter(
        VDRest.app.getModule('VDRest.Epg').getModel(
            'Channels.Channel.Broadcast',
            this.keyInCache
        )
    );

    if (this.data.dataModel.data.timer_exists) {

        VDRest.Rest.actions.deleteTimer(timer);

    } else {

        VDRest.Rest.actions.addOrUpdateTimer(timer, this.keyInCache);

    }
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
