/**
 * @class
 * @constructor
 * @property {Gui.Epg.Controller.Broadcasts.List[]} broadcastLists
 */
Gui.Epg.Controller.Broadcasts = function () {};

/**
 *
 * @type {VDRest.Abstract.Controller}
 */
Gui.Epg.Controller.Broadcasts.prototype = new VDRest.Abstract.Controller();

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

    if (VDRest.helper.touchMoveCapable) {
        this.touchScroll = new TouchMove.Scroll({
            "wrapper" : this.view.wrapper[0],
            "onmove" : this.handleScroll.bind(this)
        })
    }

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

    //if (this.dataModel.getCollection().length) {
    //    this.iterateChannels({
    //        "iterate" : $.proxy(this.dataModel.collectionIterator, this.dataModel)
    //    });
    //}
    this.startUpdateInterval();
};

/**
 * add event listeners
 */
Gui.Epg.Controller.Broadcasts.prototype.addObserver = function () {

    $(document).one('channelsloaded', this.iterateChannels.bind(this));

    if (!VDRest.helper.touchMoveCapable) {
        this.view.wrapper.get(0).onscroll = this.handleScroll.bind(this);
    }

    $(document).on('mousedown.broadcasts touchstart.broadcasts', this.toggleUpdate.bind(this));

    $(document).on('visibilitychange.broadcasts', this.toggleUpdate.bind(this, true));
};

/**
 * remove event listeners
 */
Gui.Epg.Controller.Broadcasts.prototype.removeObserver = function () {

    if (!VDRest.helper.touchMoveCapable) {
        $(this.view.wrapper).off('scroll', this.handleScroll);
    }

    $(document).off('visibilitychange.broadcasts');
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

    this.updateTimeout = setTimeout(function () {
        this.update();
        this.updateInterval = setInterval(this.update.bind(this), 60000);
    }.bind(this), next.getTime() - d.getTime());
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
    return this;
};

/**
 * periodical update
 */
Gui.Epg.Controller.Broadcasts.prototype.update = function () {

    this.setScrollData()
        .timeUpdate();
    this.view.updateIndicator();
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

    return this;
};

/**
 * iterate channel list, buffer lists
 * @param collection
 */
Gui.Epg.Controller.Broadcasts.prototype.iterateChannels = function (collection) {

    collection.iterate(function (channelModel) {

        if (!VDRest.config.getItem('showRadio') && channelModel.data.is_radio && channelModel.data.is_radio === true) {

            return true;
        }

        this.broadcastLists.push(this.module.getController('Broadcasts.List', {
            "channel_id" : channelModel.data.channel_id,
            "parent" : this,
            "dataModel" : channelModel
        }));

    }.bind(this));

    this.dispatchChannels();
};

/**
 * dispatch all lists
 */
Gui.Epg.Controller.Broadcasts.prototype.dispatchChannels = function () {

    var i= 0, l=this.broadcastLists.length, me = this;

    if (VDRest.config.getItem('useSlowServerStrategy')) {

        $(document).one('broadcastsloaded', function () {

            for (i;i<l;i++) {

                me.broadcastLists[i].dispatchView();
            }
        });

        this.module.store.getModel('Broadcasts').initBroadcasts();

    } else {

        for (i;i<l;i++) {

            this.broadcastLists[i].dispatchView();
        }
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

    if ('now' === VDRest.config.getItem('lastEpg')/* &&  this.module.getController('Epg').getScrollLeft() > -10*/) {

        this.module.store.updateNow();

        this.module.getController('TimeLine').update();

        this.broadcastLists.forEach(function (list) {

            list.updateBroadcastsPosition();
        }.bind(this));
    }
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