/**
 * @class
 * @constructor
 * @property {Gui.Epg.Controller.Broadcasts.List.Broadcast[]} broadcasts
 * @property {Gui.Epg} module
 * @property {Gui.Epg.Controller.Broadcasts} broadcastsController
 * @property {VDRest.Epg.Model.Channels.Channel} dataModel
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
    this.broadcasts = [];
    this.dateSeparators = [];
    this.view = this.module.getView('Broadcasts.List', {
        "channel_id" : this.data.channel_id,
        "group" : this.data.dataModel.data.group
    });
    this.view.setParentView(this.data.parent.view);
    this.dataModel = VDRest.app.getModule('VDRest.Epg').getModel('Channels.Channel', {
        "channel_id" : this.data.channel_id
    });
    this.scrollLeft = 0;
    this.pixelPerSecond = VDRest.config.getItem('pixelPerSecond');
    this.fromDate = this.module.getFromDate();
    this.fromTime = this.fromDate.getTime();
    this.initial = true;
    this.overflowCount = 1;

    this.setCurrentHour(new Date(1970, 0, 0));
    this.currentPosition = 0;
    this.newBroadcasts = [];

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

    var from = this.broadcasts.length > 0
            ? this.broadcasts[this.broadcasts.length - 1].data.dataModel.data.end_date
            : new Date(this.fromTime),
        minTimeSpan = this.isChannelView ? 21600000 : 3600000,
        timeSpanAdd = this.broadcastsController.getAvailableTimeSpan('milliseconds') * this.overflowCount,
        to = new Date(
            from.getTime()
            + (timeSpanAdd < minTimeSpan ? minTimeSpan : timeSpanAdd)
        );

    if (VDRest.config.getItem('loadAllChannelsInitially') || this.isInView() || this.isChannelView) {
        this.getStoreModel().getNextBroadcasts(to);
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

    $window.on('orientationchange.' + this.data.channel_id, this.handleResize.bind(this));

    $window.on('resize.' + this.data.channel_id, this.handleResize.bind(this));
};

/**
 * remove event listeners
 */
Gui.Epg.Controller.Broadcasts.List.prototype.removeObserver = function () {

    $window.off('orientationchange.' + this.data.channel_id);

    $window.off('resize.' + this.data.channel_id);
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
 * @param {jQuery.Event} collection
 * @param {function(function, function)} collection.iterate
 * @param {VDRest.Epg.Model.Channels.Channel.Broadcast[]} collection.collection
 * @param {string} collection._class
 */
Gui.Epg.Controller.Broadcasts.List.prototype.iterateBroadcasts = function (collection) {

    var isInView = this.isInView();

    collection.iterate(
        this.addBroadcasts.bind(this),
        this.addBroadcastsReady.bind(this)
    );

    this.hasInitialBroadcasts = this.broadcasts.length > 0;

    this.newBroadcasts = [];
    // runs in endless loop if previous collection had items but current not
    // trigger update ONLY if collection.length is not 0!!!
    if (collection.collection.length > 0 && isInView && !this.isChannelView) {

        this.updateList();
    }
};

/**
 * collection iterator callback
 * @param {VDRest.Epg.Model.Channels.Channel.Broadcast} dataModel
 */
Gui.Epg.Controller.Broadcasts.List.prototype.addBroadcasts = function (dataModel) {

    var dataModelHours;

    if (this.isValidBroadcast(dataModel))  {

        dataModelHours = new Date(
            dataModel.data.start_date.getFullYear(),
            dataModel.data.start_date.getMonth(),
            dataModel.data.start_date.getDate(),
            dataModel.data.start_date.getHours(), 0, 0
        );

        if (dataModelHours.getTime() > this.currentHour.getTime()) {
            this.setCurrentHour(dataModel.data.start_date);
            this.addDateSeparator();
        }

        this.addBroadcast(dataModel);
    }
};

/**
 * test if broadcast is valid
 * @param {VDRest.Epg.Model.Channels.Channel.Broadcast} dataModel
 * @return {boolean}
 */
Gui.Epg.Controller.Broadcasts.List.prototype.isValidBroadcast = function (dataModel) {

    return dataModel.data.end_date > this.fromDate
            && !(
                    this.module.cache.store.Controller['Broadcasts.List.Broadcast'] &&
                    this.module.cache.store
                        .Controller['Broadcasts.List.Broadcast'][dataModel.data.channel + '/' + dataModel.data.id]
            )
};

/**
 * handle iteration of broadcast ready
 */
Gui.Epg.Controller.Broadcasts.List.prototype.addBroadcastsReady = function () {

    var i = 0, l;

    this.broadcasts = this.broadcasts.concat(this.newBroadcasts);
    this.broadcasts.sort(this.sortBroadcasts);

    if (this.isChannelView) {

        l = this.newBroadcasts.length;

        for (i;i<l;i++) {
            this.newBroadcasts[i].dispatchView();
        }
        this.isLoading = false;
    }

    this.updateViewData().sortNodes();
};

/**
 * add broadcast
 * @param {VDRest.Epg.Model.Channels.Channel.Broadcast} dataModel
 */
Gui.Epg.Controller.Broadcasts.List.prototype.addBroadcast = function (dataModel) {

    this.newBroadcasts.push(this.module.getController('Broadcasts.List.Broadcast', {
        'channel' : dataModel.data.channel,
        'id' : dataModel.data.id,
        "parent" : this,
        "dataModel": dataModel,
        "position": this.currentPosition++
    }));
    this.newBroadcasts[this.newBroadcasts.length - 1].dispatchView();
};

/**
 * add date separator
 */
Gui.Epg.Controller.Broadcasts.List.prototype.addDateSeparator = function () {

    this.dateSeparators.push(this.module.getController('Broadcasts.List.DateSeparator', {
        "timestamp" : this.currentHour.getTime(),
        "channel_id" : this.data.channel_id,
        "parent" : this,
        "date" : this.currentHour,
        "position" : this.currentPosition++
    }));
    this.dateSeparators[this.dateSeparators.length - 1].dispatchView();
};

/**
 * set current hour
 * @param {Date} date
 * @returns {Gui.Epg.Controller.Broadcasts.List}
 */
Gui.Epg.Controller.Broadcasts.List.prototype.setCurrentHour = function (date) {

    this.currentHour = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(), 0, 0
    );

    return this;
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
        vOffset/*,
        threshold*/;

    if (l > 0) {

        metrics = this.epgController.getMetrics();
        //threshold = this.epgController.metrics.viewPort.width * this.overflowCount;
        vOffset = {
            "left" : -this.broadcastsController.currentScrollLeft + this.broadcastsController.view.left
        };

        for (i; i < l; i++) {

            this.broadcasts[i].view.update();

            // dispatch broadcast if its not but should be
            //if (!this.broadcasts[i].view.isRendered
            //    && (this.broadcasts[i].view.getLeft() + vOffset.left - threshold < metrics.win.width || this.isChannelView)
            //) {
            //
            //    this.broadcasts[i].dispatchView();
            //}
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
        timeThreshold = (this.epgController.metrics.viewPort.width / this.pixelPerSecond) * this.overflowCount,
        currentScrollLeft = this.broadcastsController.currentScrollLeft,
        currentScrollTime = this.broadcastsController.currentScrollTime - timeThreshold,
        visibleEndTime = this.broadcastsController.visibleEndTime + timeThreshold,
        broadcast, start, end;

    currentScrollTime = Math.max(currentScrollTime, this.module.getFromDate().getTime() / 1000);

    if (l > 0) {

        if (this.firstVisibleNode) {
            this.firstVisibleNode.removeClass('first-visible');
            this.firstVisibleNode = undefined;
        }
        if (this.lastVisibleNode) {
            this.lastVisibleNode.removeClass('last-visible');
            this.lastVisibleNode = undefined;
        }

        if (this.scrollLeft <= currentScrollLeft) {

            // search from start until element is visible
            for (i = 0; i < l; i++) {

                broadcast = this.broadcasts[i].getData('dataModel');
                start = broadcast.getData('start_time');
                end = broadcast.getData('end_time');

                if (end > currentScrollTime && start <= currentScrollTime) {

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

                    this.firstVisibleNode = this.broadcasts[i].view.node;
                    break;
                }
            }
        }

        if (!this.firstVisibleNode) {
            this.firstVisibleNode = this.broadcasts[0].view.node;
        }
        if (!this.lastVisibleNode) {
            this.lastVisibleNode = this.broadcasts[l - 1].view.node;
        }

        this.firstVisibleNode.addClass('first-visible');
        this.lastVisibleNode.addClass('last-visible');

        this.scrollLeft = currentScrollLeft;
    }
};

/**
 * determine if list is currently partly in view
 * and epg is not hidden
 * @returns {boolean}
 */
Gui.Epg.Controller.Broadcasts.List.prototype.isInView = function () {

    return this.isScrolledIntoInView() && !this.module.getController('Epg').isHidden;

};

/**
 * determine if list is currently partly in view
 * @returns {boolean}
 */
Gui.Epg.Controller.Broadcasts.List.prototype.isScrolledIntoInView = function () {

    var offset = {"top" : this.view.offsetTop},
        top = this.view.offsetTop,
        height = this.view.height,
        bottom = top + height,
        metrics = this.epgController.metrics,
        threshold = metrics.win.height * this.overflowCount,
        scrollTop = this.broadcastsController.currentScrollTop,
        isInView,
        currentGroup = this.broadcastsController.channelsController.currentGroup;

    if (currentGroup !== 'All' && currentGroup !== this.dataModel.data.group) {

        return false;

    } else if (!this.lastOffset || offset.top <= this.lastOffset.top) {

        isInView = bottom + threshold / 2 >= scrollTop && bottom < scrollTop + metrics.win.height + threshold;

    } else {

        isInView = bottom + threshold >= scrollTop && bottom < scrollTop + metrics.win.height + threshold / 2;
    }

    //this.lastOffset = offset;
    this.lastOffset = {"top" : top};

    return isInView;

};

/**
 * update position or width of all broadcasts on auto update
 */
Gui.Epg.Controller.Broadcasts.List.prototype.updateBroadcastsPosition = function () {

    this.deleteOutdated()
        .updateViewData()
        .sortNodes();

    if (0 === this.broadcasts.length) {
        this.hasInitialBroadcasts = undefined;
    }

    if (this.isScrolledIntoInView()) {
        this.updateList();
        this.toggleBroadcastsVisibility();
    }
};

/**
 * delete outdated events
 * @return {Gui.Epg.Controller.Broadcasts.List}
 */
Gui.Epg.Controller.Broadcasts.List.prototype.deleteOutdated = function () {

    var toDelete = [];

    this.fromTime = this.module.getFromDate().getTime();

    this.broadcasts.forEach(function (broadcast) {

        if (broadcast.getData('dataModel').getData('end_time') < (this.fromTime / 1000)) {
            toDelete.push(broadcast);
        }

    }.bind(this));

    toDelete.forEach(function (broadcast) {
        broadcast.destructView();
        this.module.cache.flushByClassKey(broadcast.keyInCache);
        this.module.store.cache.flushByClassKey(broadcast.keyInCache);
        this.broadcasts.shift();
    }.bind(this));

    this.deleteDateSeparators();

    this.module.store.cache.store.Model['Channels.Channel'][this.data.channel_id].cleanCollection();

    return this;
};

Gui.Epg.Controller.Broadcasts.List.prototype.deleteDateSeparators = function () {

    var firstDate;

    if (this.broadcasts.length > 0) {

        firstDate = this.broadcasts[0].data.dataModel.data.start_date;
        firstDate = new Date(
            firstDate.getFullYear(),
            firstDate.getMonth(),
            firstDate.getDate(),
            firstDate.getHours(), 0, 0
        );
        this.dateSeparators.forEach(function (separator) {

            if (separator.data.date.getTime() < firstDate.getTime()) {
                separator.destructView();
            }

        }.bind(this));
    }
};

/**
 * update position data, update metrics
 * @return {Gui.Epg.Controller.Broadcasts.List}
 */
Gui.Epg.Controller.Broadcasts.List.prototype.updateViewData = function () {

    var tmp = this.broadcasts.concat(this.dateSeparators), pos = 0;

    tmp.sort(this.sortChildren.bind(this));

    tmp.forEach(function (controller) {

        controller.data.position = pos;
        controller.view.data.position = pos;
        controller.view.node.get(0).dataset['pos'] = pos;

        if (controller instanceof Gui.Epg.Controller.Broadcasts.List.Broadcast) {
            controller.updateMetrics();
        }
        pos++;

    }.bind(this));

    return this;
};

/**
 * sort children by date
 * if date equals, dateSeparator is smaller then Broadcast
 * @param {Gui.Epg.Controller.Broadcasts.List.Broadcast|Gui.Epg.Controller.Broadcasts.List.DateSeparator} a
 * @param {Gui.Epg.Controller.Broadcasts.List.Broadcast|Gui.Epg.Controller.Broadcasts.List.DateSeparator} b
 */
Gui.Epg.Controller.Broadcasts.List.prototype.sortChildren = function (a, b) {

    var va, vb;

    if (a instanceof Gui.Epg.Controller.Broadcasts.List.DateSeparator) {
        va = a.data.date;
    } else {
        va = a.data.dataModel.data.start_date;
        //if (va.getTime() < this.broadcasts[0].data.dataModel.data.start_date.getTime()) {
        //    va = this.broadcasts[0].data.dataModel.data.start_date;
        //}
    }

    if (b instanceof Gui.Epg.Controller.Broadcasts.List.DateSeparator) {
        vb = b.data.date;
    } else {
        vb = b.data.dataModel.data.start_date;
        //if (vb.getTime() < this.broadcasts[0].data.dataModel.data.start_date.getTime()) {
        //    vb = this.broadcasts[0].data.dataModel.data.start_date;
        //}
    }

    if (
        (
            a instanceof Gui.Epg.Controller.Broadcasts.List.DateSeparator
            || b instanceof Gui.Epg.Controller.Broadcasts.List.DateSeparator
        ) && va.getTime() == vb.getTime()
    ) {
        if (a instanceof Gui.Epg.Controller.Broadcasts.List.DateSeparator) {
            return -1;
        }
        if (b instanceof Gui.Epg.Controller.Broadcasts.List.DateSeparator) {
            return 1;
        }
    }

    return va == vb ? 0 : (va > vb ? 1 : -1);
};

/**
 * sort child nodes by pos attribute
 */
Gui.Epg.Controller.Broadcasts.List.prototype.sortNodes = function () {

    Array.prototype.slice.apply(
        this.view.node.get(0).childNodes
    ).sort(this.nodeSort).forEach(function (node) {
            this.view.node.get(0).appendChild(node);
        }.bind(this)
    );
};

/**
 * sort view nodes by pos attribute
 * @param {HTMLDivElement} a
 * @param {HTMLDivElement} b
 * @return {number}
 */
Gui.Epg.Controller.Broadcasts.List.prototype.nodeSort = function (a, b) {

    var va = parseInt(a.dataset['pos'], 10),
        vb = parseInt(b.dataset['pos'], 10);

    return va == vb ? 0 : (va > vb ? 1 : -1);
};

/**
 * sort broadcasts by end date
 * @param {Gui.Epg.Controller.Broadcasts.List.Broadcast} a
 * @param {Gui.Epg.Controller.Broadcasts.List.Broadcast} b
 * @return {number}
 */
Gui.Epg.Controller.Broadcasts.List.prototype.sortBroadcasts = function (a, b) {

    var va = a.data.dataModel.data.end_date,
        vb = b.data.dataModel.data.end_date;

    return va == vb ? 0 : (va > vb ? 1 : -1);
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
