/**
 * @class
 * @constructor
 */
Gui.Epg.Controller.Window.Broadcast = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Epg.Controller.Window.Broadcast.prototype = new Gui.Window.Controller.Abstract();

/**
 * cache key
 * @type {string}
 */
Gui.Epg.Controller.Window.Broadcast.prototype.cacheKey = 'channel/id';

/**
 * initialize view and view model
 */
Gui.Epg.Controller.Window.Broadcast.prototype.init = function () {

    this.eventNameSpace = this.module.namespace + '-' + this.module.name;

    this.eventPrefix = 'window.broadcast.' + this.data.channel + '/' + this.data.id;

    this.view = this.module.getView('Window.Broadcast', {
        "id" : this.data.id,
        "channel" : this.data.channel
    });

    Gui.Window.Controller.Abstract.prototype.init.call(this);

    this.module.getViewModel('Window.Broadcast', {
        "id" : this.data.id,
        "channel" : this.data.channel,
        "view" : this.view,
        "resource" : this.data.dataModel
    });

};

/**
 * dispatch
 */
Gui.Epg.Controller.Window.Broadcast.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    this.handleTimerAction();

    this.addObserver();
};

/**
 * add event listeners
 */
Gui.Epg.Controller.Window.Broadcast.prototype.addObserver = function () {

    if (this.view.image) {

        this.view.image.on('click', this.animateImageAction.bind(this));
    }

    $document.on('gui-timer.created.' + this.keyInCache + '.' + this.eventNameSpace, this.handleTimerAction.bind(this));
    $document.on('gui-timer.updated.' + this.keyInCache + '.' + this.eventNameSpace, this.handleTimerAction.bind(this));
    $document.on('gui-timer.deleted.' + this.keyInCache + '.' + this.eventNameSpace, this.handleTimerAction.bind(this));
    this.view.recordButton.on('click', this.toggleTimerAction.bind(this));
    this.view.editButton.on('click', this.editTimerAction.bind(this));

    Gui.Window.Controller.Abstract.prototype.addObserver.call(this);
};
/**
 * add event listeners
 */
Gui.Epg.Controller.Window.Broadcast.prototype.removeObserver = function () {

    if (this.view.image) {

        this.view.image.off('click');
    }
    this.view.recordButton.off('click');
    $document.off('gui-timer.' + this.eventNameSpace);

    Gui.Window.Controller.Abstract.prototype.removeObserver.call(this);
};

/**
 * trigger image animation
 */
Gui.Epg.Controller.Window.Broadcast.prototype.animateImageAction = function () {

    this.vibrate();

    this.view.animateImage();
};

/**
 * handle timer
 */
Gui.Epg.Controller.Window.Broadcast.prototype.handleTimerAction = function () {

    this.view.handleTimerExists(this.data.dataModel.data.timer_exists);
    this.view.handleTimerActive(this.data.dataModel.data.timer_active);
};

/**
 * edit timer
 */
Gui.Epg.Controller.Window.Broadcast.prototype.editTimerAction = function () {

    this.vibrate();

    VDRest.app.getModule('VDRest.Timer').loadModel(
        'List.Timer',
        this.data.dataModel.data.timer_id,
        function (timer) {
            $.event.trigger({
                "type": "window.request",
                "payload": {
                    "type": "Window.Timer",
                    "module" : VDRest.app.getModule('Gui.Timer'),
                    "data": {
                        "id": timer.data.id,
                        "resource": timer,
                        "activeTab": 'edit',
                        "dontDeleteListItem": true
                    }
                }
            });
        });

};

/**
 * toggle timer for broadcast
 */
Gui.Epg.Controller.Window.Broadcast.prototype.toggleTimerAction = function () {

    var timer = new VDRest.Api.TimerAdapter(
        VDRest.app.getModule('VDRest.Epg').getModel(
            'Channels.Channel.Broadcast',
            this.keyInCache
        )
    ), resource = VDRest.app.getModule('VDRest.Timer').getResource('List.Timer');

    this.vibrate();

    if (this.data.dataModel.data.timer_exists) {

        resource.deleteTimer(timer);

    } else {

        resource.addOrUpdateTimer(timer, this.keyInCache);

    }
};
/**
 * Destroy
 */
Gui.Epg.Controller.Window.Broadcast.prototype.destructView = function () {

    var me = this;
    // apply animation
    this.view.node.toggleClass('collapse expand');
    // remove on animation end
    this.view.node.one(this.animationEndEvents, function () {

        Gui.Window.Controller.Abstract.prototype.destructView.call(me);
    });
};
