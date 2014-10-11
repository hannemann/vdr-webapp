/**
 * @class
 * @constructor
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
    this.broadcastsWrapper = this.epgController.getBroadcasts().wrapper;
    this.broadcasts = [];
    this.view = this.module.getView('Broadcasts.List', {
        "channel_id" : this.data.channel_id
    });
    this.view.setParentView(this.data.parent.view);
    this.dataModel = VDRest.app.getModule('VDRest.Epg').getModel('Channels.Channel', {
        "channel_id" : this.data.channel_id
    });
    this.scrollLeft = 0;
    this.firstVisible = 0;
    this.lastVisible = 0;
    this.initial = true;
};

/**
 * init listeners, fetch first items, dispatch
 */
Gui.Epg.Controller.Broadcasts.List.prototype.dispatchView = function () {

    this.addObserver();

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    if (this.dataModel.getCollection().length > 0) {

        this.iterateBroadcasts({
            "iterate" : $.proxy(this.dataModel.collectionIterator, this.dataModel),
            "collection" : this.dataModel.getCollection()
        });

        this.hasInitialBroadcasts = true;

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

    this.getStoreModel().getNextBroadcasts();
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

    $(document).on('broadcastsloaded-'+this.data.channel_id, $.proxy(this.iterateBroadcasts, this));

    $(window).on('orientationchange', $.proxy(this.handleResize, this));

    $(window).on('resize', $.proxy(this.handleResize, this));
};

/**
 * remove event listeners
 */
Gui.Epg.Controller.Broadcasts.List.prototype.removeObserver = function () {

    $(document).off('broadcastsloaded-'+this.data.channel_id);

    $(window).off('orientationchange', $.proxy(this.handleResize, this));

    $(window).off('resize', $.proxy(this.handleResize, this));
};

/**
 * handle channel view event
 */
Gui.Epg.Controller.Broadcasts.List.prototype.attachChannelView = function () {

    this.view.node.addClass('active');
    this.view.setIsVisible('true');
    // update list before trigger loading of remaining broadcasts
    // to prevent already loaded broadcasts to reside at the end of the list
    // if they haven't been rendered yet
    this.updateList();
    this.getStoreModel().getOneDay();
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

    var isInView = this.isInView();

    collection.iterate($.proxy(function (dataModel) {

        this.broadcasts.push(this.module.getController('Broadcasts.List.Broadcast', {
            'channel' : dataModel.data.channel,
            'id' : dataModel.data.id,
            "parent" : this,
            "dataModel" : dataModel,
            "position" : this.broadcasts.length
        }));

        if (isInView) {

            this.broadcasts[this.broadcasts.length -1].dispatchView();
        }

    }, this));
    // runs in endless loop if previous collection had items but current not
    // trigger update ONLY if collection.length is not 0!!!
    if (collection.collection.length > 0 && isInView) {

        this.updateList();
    }
};

/**
 * handle scroll events
 */
Gui.Epg.Controller.Broadcasts.List.prototype.handleScroll = function () {

    var me = this, isInView;

    !!this.scrollTimeout && clearTimeout(this.scrollTimeout);
    !!this.visibleTimeout && clearTimeout(this.visibleTimeout);

    if (!this.isChannelView) {

        isInView = this.isInView();

        if (isInView) {

            this.scrollTimeout = setTimeout(function () {

                me.updateList();

            }, 200);
        }

        if (this.isVisible != isInView) {

            this.visibleTimeout = setTimeout(function () {

                me.view.setIsVisible(isInView);
                me.isVisible = isInView;

            }, 200);
        }
    } else if (this.view.node.hasClass('active')) {

        this.scrollTimeout = setTimeout(function () {

            me.updateList();

        }, 200);
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

    var i = this.lastVisible,
        l = this.broadcasts.length,
        metrics,
        vOffset;

    if (l > 0) {

        metrics = this.epgController.getMetrics();
        vOffset = this.view.node.offset();

        for (i; i < l; i++) {

            // dispatch broadcast if its not but should be
            if (!this.broadcasts[i].view.isRendered
                && this.broadcasts[i].view.getLeft() + vOffset.left < metrics.win.width
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
                (this.epgController.getBroadcasts().node.width() - metrics.win.width)
                < this.broadcasts[l - 1].view.getRight()
            ) {

                this.epgController.getBroadcasts().node.width(metrics.win.width + this.broadcasts[l - 1].view.getRight());
            }

            this.toggleBroadcastsVisibility();

        } else if (this.view.node.hasClass('active')) {
            // load next events
            if (
                this.broadcasts[l - 1].view.getOffset().top + this.broadcasts[l - 1].view.node.height() - 100 <
                metrics.win.height
            ) {
                this.getStoreModel().getOneDay();
            }

        }
    } else if (!this.hasInitialBroadcasts) {

        this.getBroadcasts();
        this.hasInitialBroadcasts = true;
    }
};

/**
 * hide broadcasts not in view
 */
Gui.Epg.Controller.Broadcasts.List.prototype.toggleBroadcastsVisibility = function () {

    var i,
        l = this.broadcasts.length,
        currentScrollLeft = this.broadcastsWrapper.scrollLeft();

    if (l > 0) {

        if (this.scrollLeft <= currentScrollLeft) {

            i = this.firstVisible;
            // search from firstVisible until element is visible
            for (i; i < l; i++) {

                if (this.broadcasts[i].isInView()) {

                    this.broadcasts[this.firstVisible].view.node.removeClass('first-visible');
                    this.broadcasts[i].view.node.addClass('first-visible');
                    this.firstVisible = i;
                    break;
                }
            }

            // search from first visible next node until element is not visible

            for (i; i < l; i++) {

                if (!this.broadcasts[i].isInView() || i === this.broadcasts.length) {

                    this.broadcasts[this.lastVisible].view.node.removeClass('last-visible');
                    this.broadcasts[i - 1].view.node.addClass('last-visible');
                    this.lastVisible = i - 1;
                    break;
                }
            }

        } else {

            i = this.lastVisible;
            i = i <= 0 ? this.broadcasts.length - 1 : i;
            // search from lastVisible until element is visible
            for (i; i >= 0; i--) {

                if (this.broadcasts[i].isInView()) {

                    this.broadcasts[this.lastVisible].view.node.removeClass('last-visible');
                    this.broadcasts[i].view.node.addClass('last-visible');
                    this.lastVisible = i;
                    break;
                }
            }

            // search from lastVisible until element is not visible
            i--;
            i = i <= 0 ? 0 : i;
            for (i; i >= 0; i--) {

                if (!this.broadcasts[i].isInView() || i === 0) {

                    this.broadcasts[this.firstVisible].view.node.removeClass('first-visible');
                    this.broadcasts[i].view.node.addClass('first-visible');
                    this.firstVisible = i;
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
