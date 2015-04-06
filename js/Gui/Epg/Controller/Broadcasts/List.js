/**
 * @class
 * @constructor
 * @property {Gui.Epg.Controller.Broadcasts.List.Broadcast[]} broadcasts
 * @property {Gui.Epg} module
 */
Gui.Epg.Controller.Broadcasts.List = function () {};

/**
 * @type {VDRest.Lib.Cache.store.Controller}
 */
Gui.Epg.Controller.Broadcasts.List.prototype = new VDRest.Abstract.Controller();

/**
 * controller cache key
 * @type {string}
 */
Gui.Epg.Controller.Broadcasts.List.prototype.cacheKey = 'channel_id';

/**
 * @type {boolean}
 */
Gui.Epg.Controller.Broadcasts.List.prototype.isChannelView = false;

/**
 * @type {boolean}
 */
Gui.Epg.Controller.Broadcasts.List.prototype.isVisible = true;

/**
 * get main controller, init collection, fetch view
 */
Gui.Epg.Controller.Broadcasts.List.prototype.init = function () {

    this.epgController = this.module.getController('Epg');
    this.broadcastsController = this.epgController.getBroadcasts();
    this.broadcastsWrapper = this.broadcastsController.view.wrapper;
    this.broadcasts = [];
    this.view = this.module.getView('Broadcasts.List', {
        "channel_id" : this.data.channel_id
    });
    this.view.setParentView(this.data.parent.view);
    this.dataModel = VDRest.app.getModule('VDRest.Epg').getModel('Channels.Channel', {
        "channel_id" : this.data.channel_id
    });
    this.scrollLeft = 0;
    this.pixelPerSecond = VDRest.config.getItem('pixelPerSecond');
    this.fromTime = this.module.getFromDate().getTime();
    this.initial = true;

    this.addObserver();
};

/**
 * init listeners, fetch first items, dispatch
 */
Gui.Epg.Controller.Broadcasts.List.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    if (this.dataModel.getCollection().length > 0) {

        this.iterateBroadcasts({
            "iterate": this.dataModel.collectionIterator.bind(this.dataModel),
            "collection" : this.dataModel.getCollection()
        });

    } else {

        this.getBroadcasts();
    }
};

/**
 * retrieve store model
 * @returns {VDRest.Epg.Model.Channels.Channel}
 */
Gui.Epg.Controller.Broadcasts.List.prototype.getStoreModel = function () {

    if (!this.storeModel) {
        this.storeModel = this.module.store.getModel('Channels.Channel', {
            "channel_id" : this.data.channel_id
        });
    }

    return this.storeModel;
};

/**
 * trigger loading of broadcasts
 */
Gui.Epg.Controller.Broadcasts.List.prototype.getBroadcasts = function () {

    if (VDRest.config.getItem('loadAllChannelsInitially') || this.isInView()) {
        this.getStoreModel().getNextBroadcasts();
    }
};

/**
 * poor orphaned piece of useless code
 */
Gui.Epg.Controller.Broadcasts.List.prototype.initList = function () {
};

/**
 * add event listeners
 */
Gui.Epg.Controller.Broadcasts.List.prototype.addObserver = function () {

    $(document).on('broadcastsloaded-' + this.data.channel_id, this.iterateBroadcasts.bind(this));

    $(window).on('orientationchange.' + this.data.channel_id, this.handleResize.bind(this));

    $(window).on('resize.' + this.data.channel_id, this.handleResize.bind(this));
};

/**
 * remove event listeners
 */
Gui.Epg.Controller.Broadcasts.List.prototype.removeObserver = function () {

    $(document).off('broadcastsloaded-'+this.data.channel_id);

    $(window).off('orientationchange.' + this.data.channel_id);

    $(window).off('resize.' + this.data.channel_id);
};

/**
 * handle channel view event
 */
Gui.Epg.Controller.Broadcasts.List.prototype.attachChannelView = function () {

    this.view.node.addClass('active');
    this.view.setIsVisible('true');
    this.broadcastsController.saveState();
    this.broadcastsController.scrollTop();
    this.updateList();
};

/**
 * remove from channelview
 */
Gui.Epg.Controller.Broadcasts.List.prototype.detachChannelView = function () {

    this.view.node.removeClass('active');
};

/**
 * iterate loaded broadcasts
 * @param collection
 */
Gui.Epg.Controller.Broadcasts.List.prototype.iterateBroadcasts = function (collection) {

    var isInView = this.isInView(), newBroadcasts = [];

    collection.iterate(function (dataModel) {

        if (dataModel.data.end_date <= this.module.getFromDate()) return;

        newBroadcasts.push(this.module.getController('Broadcasts.List.Broadcast', {
            'channel' : dataModel.data.channel,
            'id' : dataModel.data.id,
            "parent" : this,
            "dataModel": dataModel
        }));

    }.bind(this), function () {

        var i= 0, l;

        this.broadcasts = this.broadcasts.concat(newBroadcasts);

        if (this.isChannelView) {

            l = newBroadcasts.length;

            for (i;i<l;i++) {
                newBroadcasts[i].dispatchView();
            }
            this.isLoading = false;
        }

    }.bind(this));

    this.hasInitialBroadcasts = this.broadcasts.length > 0;

    newBroadcasts = [];
    // runs in endless loop if previous collection had items but current not
    // trigger update ONLY if collection.length is not 0!!!
    if (collection.collection.length > 0 && isInView && !this.isChannelView) {

        this.updateList();
    }
};

/**
 * handle scroll events
 */
Gui.Epg.Controller.Broadcasts.List.prototype.handleScroll = function () {

    var isInView;

    if (!this.isChannelView) {

        isInView = this.isInView();

        if (isInView) {
            this.updateList();
        }

        if (this.isVisible != isInView) {
            this.view.setIsVisible(isInView);
            this.isVisible = isInView;
        }
    } else if (this.view.node.hasClass('active') && !this.isLoading) {

        this.updateList();
    }
};

/**
 * handle resize events
 */
Gui.Epg.Controller.Broadcasts.List.prototype.handleResize = function () {

    if (this.module.isMuted || this.module.getController('Epg').isHidden) return;

    if (!this.isChannelView && this.isInView()) {

        this.updateList();
    }
};

/**
 * update list items if list is in view
 */
Gui.Epg.Controller.Broadcasts.List.prototype.updateList = function () {

    var i = 0,
        l = this.broadcasts.length,
        metrics,
        vOffset;

    if (l > 0) {

        metrics = this.epgController.getMetrics();
        vOffset = this.view.node.offset();

        for (i; i < l; i++) {

            // dispatch broadcast if its not but should be
            if (!this.broadcasts[i].view.isRendered
                && (this.broadcasts[i].view.getLeft() + vOffset.left < metrics.win.width || this.isChannelView)
            ) {

                this.broadcasts[i].dispatchView();
            }
        }

        if (!this.isChannelView) {
            // load next events
            if (this.broadcasts[l - 1].view.getLeft() + vOffset.left < metrics.win.width) {

                this.getBroadcasts();
            }

            // adjust width of parentView
            if (
                (metrics.broadcasts.width - metrics.win.width)
                < this.broadcasts[l - 1].view.getRight()
            ) {

                this.broadcastsController.view.node.width(metrics.win.width + this.broadcasts[l - 1].view.getRight());
            }

            this.toggleBroadcastsVisibility();

        } else if (this.view.node.hasClass('active')) {
            // load next events
            if (
                this.broadcasts[l - 1].view.getOffset().top + this.broadcasts[l - 1].view.node.height() - 100 <
                metrics.win.height
            ) {
                this.isLoading = true;
                this.getStoreModel().getOneDay();
            }

        }
    } else if (!this.hasInitialBroadcasts) {

        this.getBroadcasts();
    }
};

/**
 * hide broadcasts not in view
 */
Gui.Epg.Controller.Broadcasts.List.prototype.toggleBroadcastsVisibility = function () {

    var i,
        l = this.broadcasts.length,
        wrapperWidth = this.broadcastsController.view.wrapper[0].offsetWidth,
        currentScrollLeft = Math.abs(this.epgController.getScrollLeft()),
        currentScrollDate = new Date((currentScrollLeft / this.pixelPerSecond) * 1000 + this.fromTime),
        currentScrollTime = currentScrollDate.getTime() / 1000,
        visibleEndDate = new Date((wrapperWidth / this.pixelPerSecond) * 1000 + currentScrollTime * 1000),
        visibleEndTime = visibleEndDate.getTime() / 1000,
        broadcast, start, end;

    if (l > 0) {

        if (this.firstVisibleNode) this.firstVisibleNode.removeClass('first-visible');
        if (this.lastVisibleNode) this.lastVisibleNode.removeClass('last-visible');

        if (this.scrollLeft <= currentScrollLeft) {

            // search from start until element is visible
            for (i = 0; i < l; i++) {

                broadcast = this.broadcasts[i].getData('dataModel');
                start = broadcast.getData('start_time');
                end = broadcast.getData('end_time');

                if (end > currentScrollTime && start <= currentScrollTime) {

                    this.broadcasts[i].view.node.addClass('first-visible');
                    this.firstVisibleNode = this.broadcasts[i].view.node;
                    break;
                }
            }

            // search from start until element is not visible

            for (i = 0; i < l; i++) {

                broadcast = this.broadcasts[i].getData('dataModel');
                start = broadcast.getData('start_time');
                end = broadcast.getData('end_time');

                if (i > 0 && start > visibleEndTime || i === this.broadcasts.length) {

                    this.broadcasts[i - 1].view.node.addClass('last-visible');
                    this.lastVisibleNode = this.broadcasts[i - 1].view.node;
                    break;
                }
            }

        } else {

            // search from end until element is visible
            for (i = this.broadcasts.length - 1; i >= 0; i--) {

                broadcast = this.broadcasts[i].getData('dataModel');
                start = broadcast.getData('start_time');
                end = broadcast.getData('end_time');

                if (start <= visibleEndTime) {

                    this.broadcasts[i].view.node.addClass('last-visible');
                    this.lastVisibleNode = this.broadcasts[i].view.node;
                    break;
                }
            }

            // search from end until element is not visible
            for (i = this.broadcasts.length - 1; i >= 0; i--) {

                broadcast = this.broadcasts[i].getData('dataModel');
                start = broadcast.getData('start_time');
                end = broadcast.getData('end_time');

                if (end <= currentScrollTime || i === 0) {

                    this.broadcasts[i].view.node.addClass('first-visible');
                    this.firstVisibleNode = this.broadcasts[i].view.node;
                    break;
                }
            }

        }

        this.scrollLeft = currentScrollLeft;
    }
};

/**
 * determine if list is currently partly in view
 * @returns {boolean}
 */
Gui.Epg.Controller.Broadcasts.List.prototype.isInView = function () {

    var offset = this.view.node.offset(),
        top = offset.top,
        height = this.view.node.height(),
        bottom = top + height,
        metrics = this.epgController.getMetrics(),
        threshold = 120;

    return top - threshold < metrics.win.height
            && bottom + threshold > metrics.broadcasts.top
            && !this.module.getController('Epg').isHidden;

};


Gui.Epg.Controller.Broadcasts.List.prototype.updateBroadcastsPosition = function () {

    this.fromTime = this.module.getFromDate().getTime();

    this.broadcasts.forEach(function (broadcast) {

        if (broadcast.getData('dataModel').getData('end_time') < this.fromTime / 1000) {
            broadcast.destructView();
            this.module.cache.flushByClassKey(broadcast.keyInCache);
            this.module.store.cache.flushByClassKey(broadcast.keyInCache);
            this.broadcasts.shift();
            this.module.store.cache.store.Model['Channels.Channel'][broadcast.data.channel].cleanCollection();
        } else {
            broadcast.updateMetrics();
            broadcast.view.update();
        }

    }.bind(this));
    this.updateList();
};

/**
 * destruct
 */
Gui.Epg.Controller.Broadcasts.List.prototype.destructView = function () {

    var i= 0, l=this.broadcasts.length;

    for (i;i<l;i++) {

        this.broadcasts[i].destructView();
    }

    VDRest.Abstract.Controller.prototype.destructView.call(this);
};
