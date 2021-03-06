/**
 * @class
 * @constructor
 * @property {Gui.Epg.Controller.Broadcasts.List[]} broadcastLists
 * @property {Gui.Epg.Controller.Channels} channelsController
 * @property {Gui.Epg.Controller.TimeLine} timeLineController
 * @property {Gui.Epg.Controller.Epg} epgController
 * @property {Gui.Epg.Controller.Broadcasts.List.Broadcast} requestedBroadcast
 * @property {VDRest.Epg.Model.Channels} dataModel
 * @property {Gui.Epg.View.Broadcasts} view
 * @property {float} pixelPerSecond
 * @property {function} handleScrollBroadcasts
 * @property {function} channelIterator
 * @property {function} pointerStartHandler
 * @property {function} pointerMoveHandler
 * @property {function} pointerEndHandler
 * @property {function} timerHandler
 * @property {boolean|undefined} preventClick
 * @property {string} lastEpg
 * @property {Gui.Epg} module
 * @property {TouchMove.Scroll} touchScroll
 * @property {number} currentScrollTime
 * @property {number} visibleEndTime
 * @property {number} currentScrollLeft
 * @property {number} currentScrollTop
 * @property {string[]} groups
 * @property {VDRest.Lib.StyleSheet} channelsCSS
 */
Gui.Epg.Controller.Broadcasts = function () {};

/**
 *
 * @type {VDRest.Abstract.Controller}
 */
Gui.Epg.Controller.Broadcasts.prototype = new VDRest.Abstract.Controller();

/**
 * @type {string}
 */
Gui.Epg.Controller.Broadcasts.prototype.itemController = 'Broadcasts.List.Broadcast';

/**
 * initialize view and datamodel
 */
Gui.Epg.Controller.Broadcasts.prototype.init = function () {

    this.view = this.module.getView('Broadcasts');
    this.view.setParentView(this.data.parent.view);
    this.broadcastLists = [];
    this.dataModel = VDRest.app.getModule('VDRest.Epg').getModel('Channels');
    this.channelsController = this.module.getController('Channels');
    this.timeLineController = this.module.getController('TimeLine');
    this.pixelPerSecond = VDRest.config.getItem('pixelPerSecond');
    this.handleScrollBroadcasts = this.fnHandleScrollBroadcasts.bind(this);
    this.lastEpg = VDRest.config.getItem('lastEpg');
    this.groups = [];
    this.channelsCSS = new VDRest.Lib.StyleSheet();

    if (VDRest.helper.touchMoveCapable) {
        this.touchScroll = new TouchMove.Scroll({
            "wrapper" : this.view.wrapper[0],
            "onmove" : this.handleScroll.bind(this),
            "hasScrollBars" : true,
            "scrollBarOptions" : {
                "className" : "epg-scrollbar"
            }
        })
    }
    //else {
    //    this.scrollBars = {
    //        "x" : new TouchMove.ScrollBar({
    //            "parent" : this.view.wrapper[0],
    //            "scrollElement" : this.view.node.get(0),
    //            "className" : "epg-scrollbar",
    //            "direction" : "x"
    //        }),
    //        "y" : new TouchMove.ScrollBar({
    //            "parent" : this.view.wrapper[0],
    //            "scrollElement" : this.view.node.get(0),
    //            "className" : "epg-scrollbar"
    //        })
    //    }
    //}

    this.addObserver();
};

Gui.Epg.Controller.Broadcasts.prototype.width = function () {

    return this.view.node.width();
};

Gui.Epg.Controller.Broadcasts.prototype.height = function () {

    return this.view.node.height();
};

/**
 * dispatch
 */
Gui.Epg.Controller.Broadcasts.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    this.epgController = this.module.getController('Epg');

    this.setScrollData();
    if ('now' === this.lastEpg) {
        this.startUpdateInterval();
    }
};

/**
 * add event listeners
 */
Gui.Epg.Controller.Broadcasts.prototype.addObserver = function () {

    var wheelEvent;

    this.channelIterator = this.iterateChannels.bind(this);
    $document.one('channelsloaded', this.channelIterator);

    this.broadcastsLoadedHandler = this.delegateBroadcastsLoaded.bind(this);
    $document.on('broadcastsloaded', this.broadcastsLoadedHandler);

    this.pointerStartHandler = this.handleDown.bind(this);
    this.pointerMoveHandler = this.handleMove.bind(this);
    this.pointerEndHandler = this.handleUp.bind(this);
    this.view.node[0].addEventListener(VDRest.helper.pointerStart, this.pointerStartHandler);
    this.view.node[0].addEventListener(VDRest.helper.pointerMove, this.pointerMoveHandler);
    this.view.node[0].addEventListener(VDRest.helper.pointerEnd, this.pointerEndHandler);

    this.timerHandler = this.handleTimer.bind(this);
    $document.on('gui-timer.created', this.timerHandler);
    $document.on('gui-timer.updated.epg', this.timerHandler);
    $document.on('gui-timer.deleted.epg', this.timerHandler);

    if (!VDRest.helper.touchMoveCapable) {
        this.view.wrapper.get(0).onscroll = this.handleScroll.bind(this);
    }

    if (!VDRest.helper.isTouchDevice) {
        wheelEvent = 'onwheel' in document.documentElement ? 'wheel' : 'mousewheel';
        this.wheelHandler = this.handleWheel.bind(this);
        this.view.wrapper.on(wheelEvent, this.wheelHandler);
    }

    if ('now' === this.lastEpg) {
        $document.on(VDRest.helper.pointerStart + '.broadcasts', this.toggleUpdate.bind(this));
        $document.on('visibilitychange.broadcasts', this.toggleUpdate.bind(this, true));
    }
};

/**
 * remove event listeners
 */
Gui.Epg.Controller.Broadcasts.prototype.removeObserver = function () {

    var wheelEvent;

    $document.off('channelsloaded', this.channelIterator);

    $document.off('broadcastsloaded', this.broadcastsLoadedHandler);

    this.view.node[0].removeEventListener(VDRest.helper.pointerStart, this.pointerStartHandler);
    this.view.node[0].removeEventListener(VDRest.helper.pointerMove, this.pointerMoveHandler);
    this.view.node[0].removeEventListener(VDRest.helper.pointerEnd, this.pointerEndHandler);

    $document.on('gui-timer.created', this.timerHandler);
    $document.on('gui-timer.updated.epg', this.timerHandler);
    $document.on('gui-timer.deleted.epg', this.timerHandler);

    if (!VDRest.helper.touchMoveCapable) {
        $(this.view.wrapper).off('scroll', this.handleScroll);
    }

    if (!VDRest.helper.isTouchDevice) {
        wheelEvent = 'onwheel' in document.documentElement ? 'wheel' : 'mousewheel';
        this.view.wrapper.off(wheelEvent, this.wheelHandler);
    }

    if ('now' === this.lastEpg) {
        $document.off(VDRest.helper.pointerStart + '.broadcasts');
        $document.off('visibilitychange.broadcasts');
    }
};

/**
 * handle mousedown
 */
Gui.Epg.Controller.Broadcasts.prototype.handleDown = function (e) {

    var broadcast = this.getBroadcastFromEvent(e),
        menuRequest = this.getMenuButtonWasClicked(e),
        wrapper;

    if (!broadcast && !menuRequest) {
        return;
    }

    this.requestedBroadcast = this.module.getController(this.itemController, broadcast.dataset.key);

    activeAnimate.applyAnimation(e, broadcast);

    this.preventClick = undefined;

    if (!VDRest.helper.isTouchDevice && "undefined" !== typeof this.view.wrapper) {
        wrapper = this.view.wrapper.get(0);
        this.canMove = true;
        wrapper.classList.add('move');
        this.currentMouse = {
            "x" : e.clientX,
            "y" : e.clientY
        };
        this.currentScroll = {
            "x" : wrapper.scrollLeft,
            "y" : wrapper.scrollTop
        };
        this.view.wrapper.one('mouseleave', function () {
            this.canMove = false;
            wrapper.classList.remove('move');
        }.bind(this));

    }

    this.clickTimeout = window.setTimeout(function () {
        if (!this.module.isMuted) {
            this.vibrate(100);
            this.preventClick = true;

            activeAnimate.endAnimation();
            $document.one(VDRest.helper.pointerEnd, function () {
                if (!VDRest.helper.canCancelEvent) {
                    this.requestedBroadcast.requestMenuAction(e);
                }
            }.bind(this));
        }
    }.bind(this), 1000);
};

/**
 * prevent click on move
 */
Gui.Epg.Controller.Broadcasts.prototype.handleMove = function (e) {

    var delta, wrapper;

    this.preventClick = true;

    if ("undefined" !== typeof this.clickTimeout) {
        window.clearTimeout(this.clickTimeout);
    }

    if (this.canMove) {
        wrapper = this.view.wrapper.get(0);
        delta = {
            "x" : this.currentMouse.x - e.clientX,
            "y" : this.currentMouse.y - e.clientY
        };

        this.currentMouse.x = e.clientX;
        this.currentMouse.y = e.clientY;

        delta.x = this.currentScroll.x + delta.x > 0 ? delta.x : 0;
        delta.y = this.currentScroll.y + delta.y > 0 ? delta.y : 0;

        wrapper.scrollLeft = this.currentScroll.x = this.currentScroll.x + delta.x;
        wrapper.scrollTop = this.currentScroll.y = this.currentScroll.y + delta.y;
    }

    if ("undefined" !== typeof this.scrollBars) {
        this.updateScrollBars();
    }
};


/**
 * handle mouseup
 * @param {jQuery.Event} e
 * @param {boolean} e.cancelable
 */
Gui.Epg.Controller.Broadcasts.prototype.handleUp = function (e) {

    if (e.cancelable) {
        e.preventDefault();
    }

    if (this.canMove) {
        this.canMove = false;
        this.view.wrapper.get(0).classList.remove('move');
        this.view.wrapper.off('mouseleave');
    }

    if (!this.module.isMuted) {

        if ("undefined" === typeof this.preventClick) {

            this.vibrate();

            if ("undefined" !== typeof this.clickTimeout) {
                window.clearTimeout(this.clickTimeout);
            }
            if (!VDRest.helper.canCancelEvent && "undefined" !== typeof this.requestedBroadcast) {

                if (this.getMenuButtonWasClicked(e)) {
                    this.requestedBroadcast.requestMenuAction(e);
                } else {
                    this.requestedBroadcast.requestWindowAction();
                }
            }
            this.requestedBroadcast = undefined;
        }
    }
};

/**
 * handle wheel events
 * @param {jQuery.Event} e
 */
Gui.Epg.Controller.Broadcasts.prototype.handleWheel = function (e) {

    var wrapper, event, step;

    if ("undefined" !== typeof this.view.wrapper) {
        event = e.originalEvent;
        wrapper = this.view.wrapper.get(0);

        step = {
            "x" : VDRest.helper.isFirefox ? event.deltaX * 15 : event.deltaX,
            "y" : VDRest.helper.isFirefox ? event.deltaY * 15 : event.deltaY
        };

        wrapper.scrollLeft = wrapper.scrollLeft + step.x;
        wrapper.scrollTop = wrapper.scrollTop + step.y;
    }
};

Gui.Epg.Controller.Broadcasts.prototype.updateScrollBars = function () {

    var i, wrapper = this.view.wrapper.get(0);

    for (i in this.scrollBars) {
        if (this.scrollBars.hasOwnProperty(i)) {
            this.scrollBars[i].onscroll({
                "x": wrapper.scrollLeft,
                "y": wrapper.scrollTop
            });
        }
    }
};

/**
 * delegate timer event to epg broadcast and window
 * @param {jQuery.Event} e
 * @param {{}} e.payload
 * @param {string} e.payload.event
 */
Gui.Epg.Controller.Broadcasts.prototype.handleTimer = function (e) {

    try {

        if (this.cache['Broadcasts.List.Broadcast'][e.payload.event]) {
            this.cache['Broadcasts.List.Broadcast'][e.payload.event].handleTimer();
        }

        if (this.cache['Window.Broadcast'][e.payload.event]) {
            this.cache['Window.Broadcast'][e.payload.event].handleTimer();
        }
    } catch (e) {
    }

};

/**
 * delegate broadcasts loaded events to according controller
 * @param {jQuery.Event} e
 * @param {function(function)} e.iterate
 * @param {VDRest.Epg.Model.Channels.Channel.Broadcast[]} e.collection
 * @param {string} e._class
 * @param {Gui.Epg.Controller.Broadcasts.List} e.payload
 */
Gui.Epg.Controller.Broadcasts.prototype.delegateBroadcastsLoaded = function (e) {

    this.cache['Broadcasts.List'][e.payload].iterateBroadcasts(e);
};

/**
 * retrieve broadcast node from event
 * @param {Event} e
 * @return {null|HTMLDivElement}
 */
Gui.Epg.Controller.Broadcasts.prototype.getBroadcastFromEvent = function (e) {

    var broadcast = null, node = e.target;

    while (node != document.body) {
        if ("undefined" !== typeof node.classList && node.classList.contains('broadcast')) {
            broadcast = node;
            break;
        }
        node = node.parentNode;
    }

    return broadcast;
};

/**
 * check if menu button of event was clicked
 * @param {Event} e
 * @param {HTMLElement} e.target
 * @return {boolean}
 */
Gui.Epg.Controller.Broadcasts.prototype.getMenuButtonWasClicked = function (e) {

    return e.target.classList.contains('listitem-menu-button');
};

/**
 * toggle update of indicator
 */
Gui.Epg.Controller.Broadcasts.prototype.toggleUpdate = function (instantUpdate) {

    if ('visible' === document.visibilityState) {
        this.stopUpdateInterval()
            .startUpdateInterval();
        if (true === instantUpdate) {
            this.update();
        }
    } else {
        this.stopUpdateInterval();
    }
};

/**
 * start interval to update indicator
 */
Gui.Epg.Controller.Broadcasts.prototype.startUpdateInterval = function () {

    var d = new Date(),
        next = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + 2, 0);

    if ("undefined" !== typeof this.updateTimeout) {
        clearTimeout(this.updateTimeout);
        this.updateTimeout = undefined;
    }

    if (this.module.store.debugUpdate) {

        this.updateTimeout = setTimeout(function () {
            this.update();
            this.updateInterval = setInterval(this.update.bind(this), 500);
        }.bind(this), 10000);
    } else {

        this.updateTimeout = setTimeout(function () {
            this.update();
            this.updateInterval = setInterval(this.update.bind(this), 60000);
        }.bind(this), next.getTime() - d.getTime());
    }

};

/**
 * stop indicator update interval
 * @returns {Gui.Epg.Controller.Broadcasts}
 */
Gui.Epg.Controller.Broadcasts.prototype.stopUpdateInterval = function () {

    if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = undefined;
    }
    if (this.updateTimeout) {
        clearTimeout(this.updateTimeout);
        this.updateTimeout = undefined;
    }
    return this;
};

/**
 * periodical update
 */
Gui.Epg.Controller.Broadcasts.prototype.update = function () {

    if (VDRest.helper.hasConnection() && 'now' === this.lastEpg) {

        this.module.store.updateNow();
        this.setScrollData()
            .timeUpdate();
        this.view.updateIndicator();
    }
};

/**
 * retrieve available timespan for events according to chosen type
 * depends on pixel per seconds value
 *
 * @param type
 * @returns {number}
 */
Gui.Epg.Controller.Broadcasts.prototype.getAvailableTimeSpan = function (type) {

    var pps = VDRest.config.getItem('pixelPerSecond');

    switch (type) {
        case "milliseconds":
            return this.view.wrapper.innerWidth() / (pps) * 1000;
        case "seconds":
            return this.view.wrapper.innerWidth() / (pps);
        case "minutes":
            return this.view.wrapper.innerWidth() / (pps * 60);
        case "hours":
        default:
            return this.view.wrapper.innerWidth() / (pps * 60 * 60);
    }

};

/**
 * handle scroll events
 */
Gui.Epg.Controller.Broadcasts.prototype.handleScroll = function (e) {

    this.channelsController.handleScroll(e);
    this.timeLineController.handleScroll(e);

    !!this.scrollTimeout && clearTimeout(this.scrollTimeout);

    this.scrollTimeout = setTimeout(this.handleScrollBroadcasts, 200);
};

/**
 * iterate broadcast lists and call their scroll handler
 * @param {jQuery.Event} e
 */
Gui.Epg.Controller.Broadcasts.prototype.fnHandleScrollBroadcasts = function (e) {

    var i;

    this.epgController.setMetrics();
    this.setScrollData();

    for (i in this.broadcastLists) {
        if (this.broadcastLists.hasOwnProperty(i)) {

            this.broadcastLists[i].handleScroll(e);
        }
    }
};

Gui.Epg.Controller.Broadcasts.prototype.setScrollData = function () {

    var wrapperWidth = this.view.wrapper[0].offsetWidth,
        currentScrollLeft = Math.abs(this.epgController.getScrollLeft()),
        currentScrollDate = new Date((currentScrollLeft / this.pixelPerSecond) * 1000 + this.module.getFromDate().getTime()),
        currentScrollTime = currentScrollDate.getTime() / 1000,
        visibleEndDate = new Date((wrapperWidth / this.pixelPerSecond) * 1000 + currentScrollTime * 1000),
        visibleEndTime = visibleEndDate.getTime() / 1000;

    this.currentScrollTime = currentScrollTime;
    this.visibleEndTime = visibleEndTime;
    this.currentScrollLeft = currentScrollLeft;
    this.currentScrollTop = Math.abs(this.epgController.getScrollTop());

    return this;
};

/**
 * iterate channel list, buffer lists
 * @param collection
 * @param {function()} collection.iterate
 */
Gui.Epg.Controller.Broadcasts.prototype.iterateChannels = function (collection) {

    collection.iterate(this.processChannel.bind(this));

    this.dispatchChannels();
};

/**
 * process channel
 * @param {VDRest.Epg.Model.Channels.Channel} channelModel
 */
Gui.Epg.Controller.Broadcasts.prototype.processChannel = function (channelModel) {

    var group = channelModel.getData('group');

    if (!VDRest.config.getItem('showRadio') && channelModel.data.is_radio && channelModel.data.is_radio === true) {

        return true;
    }

    this.broadcastLists.push(this.module.getController('Broadcasts.List', {
        "channel_id" : channelModel.data.channel_id,
        "parent" : this,
        "dataModel" : channelModel
    }));

    if (this.groups.indexOf(group) < 0) {
        this.groups.push(group);
        this.channelsCSS.addRule(
            '#epg[data-show-group="' + group + '"] .broadcasts-list[data-channel-group="' + group + '"]',
            'display: block'
        );
    }
};

/**
 * dispatch all lists
 */
Gui.Epg.Controller.Broadcasts.prototype.dispatchChannels = function () {

    var i= 0, l=this.broadcastLists.length;

    for (i;i<l;i++) {

        this.broadcastLists[i].dispatchView();
    }
};

/**
 * scroll to top position
 */
Gui.Epg.Controller.Broadcasts.prototype.scrollTop = function () {

    var state;

    if (VDRest.helper.touchMoveCapable) {

        state = this.touchScroll.slider.getState();
        this.touchScroll.slider.translate({
            "x": state.x * -1,
            "y": state.y * -1
        });
    } else {
        this.view.wrapper.scrollTop(0);
        this.view.wrapper.scrollLeft(0);
    }
};

/**
 * save current scroll position
 */
Gui.Epg.Controller.Broadcasts.prototype.saveState = function () {

    if (this.hasData('state')) return;

    if (VDRest.helper.touchMoveCapable) {
        this.setData('state', this.touchScroll.slider.getState());
    } else {
        this.setData('state', {
            "top": this.view.wrapper.scrollTop(),
            "left": this.view.wrapper.scrollLeft()
        });
    }
};

/**
 * recover scroll position
 */
Gui.Epg.Controller.Broadcasts.prototype.recoverState = function () {

    if (VDRest.helper.touchMoveCapable) {
        this.scrollTop();
        this.touchScroll.slider.translate({
            "x": this.getData('state').x,
            "y": this.getData('state').y
        });
    } else {
        this.view.wrapper.scrollTop(this.getData('state').top);
        this.view.wrapper.scrollLeft(this.getData('state').left);
    }

    this.unsData('state');

};

/**
 * trigger update of broadcast lists
 */
Gui.Epg.Controller.Broadcasts.prototype.timeUpdate = function () {

    this.timeLineController.update();

    this.broadcastLists.forEach(function (list) {

        list.updateBroadcastsPosition();
    }.bind(this));
};

Gui.Epg.Controller.Broadcasts.prototype.updateOffsets = function () {


    this.broadcastLists.forEach(function (list) {

        list.view.setOffset();
    }.bind(this));
};

/**
 * DESTROY!
 */
Gui.Epg.Controller.Broadcasts.prototype.destructView = function () {

    var i= 0, l=this.broadcastLists.length;

    for (i;i<l;i++) {

        this.broadcastLists[i].destructView();
    }
    this.stopUpdateInterval();
    VDRest.Abstract.Controller.prototype.destructView.call(this);
};