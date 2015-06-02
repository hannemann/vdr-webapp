/**
 * @class
 * @constructor
 */
Gui.Epg.Controller.Window.Broadcast = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Epg.Controller.Window.Broadcast.prototype = new Gui.Window.Controller.ScrollAnimateHeader();

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

    this.module.getViewModel('Window.Broadcast', {
        "id" : this.data.id,
        "channel" : this.data.channel,
        "view" : this.view,
        "resource" : this.data.dataModel
    });

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );

    Gui.Window.Controller.ScrollAnimateHeader.prototype.init.call(this);
};

/**
 * dispatch
 */
Gui.Epg.Controller.Window.Broadcast.prototype.dispatchView = function () {

    $.event.trigger({
        "type" : "hideContextMenu"
    });

    Gui.Window.Controller.ScrollAnimateHeader.prototype.dispatchView.call(this);

    this.handleTimer();

    this.addObserver();

    this.header = VDRest.app.getModule('Gui.Menubar').getView('Default').getHeader();
    this.oldHeader = this.header.text();
    this.header.text(this.data.dataModel.data.title);
};

/**
 * add event listeners
 */
Gui.Epg.Controller.Window.Broadcast.prototype.addObserver = function () {

    if (this.view.image) {

        this.view.image.on('click', this.animateImageAction.bind(this));
    }

    this.view.recordButton.on('click', this.toggleTimerAction.bind(this));
    this.view.editButton.on('click', this.editTimerAction.bind(this));

    if (this.view.fanart && !VDRest.helper.touchMoveCapable) {
        this.scrollHandler = this.onscrollAction.bind(this);
        this.view.node.on('scroll', this.scrollHandler);
    }

    Gui.Window.Controller.ScrollAnimateHeader.prototype.addObserver.call(this);
};
/**
 * add event listeners
 */
Gui.Epg.Controller.Window.Broadcast.prototype.removeObserver = function () {

    if (this.view.image) {

        this.view.image.off('click');
    }
    this.view.recordButton.off('click');
    this.view.editButton.off('click');

    Gui.Window.Controller.ScrollAnimateHeader.prototype.removeObserver.call(this);
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
Gui.Epg.Controller.Window.Broadcast.prototype.handleTimer = function () {

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
    // remove on animation end
    this.view.node.one(this.animationEndEvents, function () {

        Gui.Window.Controller.ScrollAnimateHeader.prototype.destructView.call(me);

        $.event.trigger({
            "type" : "showContextMenu"
        });
    });
    // apply animation
    this.view.node.toggleClass('collapse expand');

    this.header.text(this.oldHeader);
};
