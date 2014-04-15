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
 * get main controller, init collection, fetch view
 */
Gui.Epg.Controller.Broadcasts.List.prototype.init = function () {

    this.epgController = this.module.getController('Epg');
    this.broadcasts = [];
    this.toRender = [];
    this.view = this.module.getView('Broadcasts.List', {
        "channel_id" : this.data.channel_id
    });
    this.view.setParentView(this.data.parent.view);
    this.dataModel = VDRest.app.getModule('VDRest.Epg').getModel('Channels.Channel', {
        "channel_id" : this.data.channel_id
    });
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
    } else {

        this.getBroadcasts();
    }
};

/**
 * retrieve store model
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

Gui.Epg.Controller.Broadcasts.List.prototype.initList = function () {
};

/**
 * add event listeners
 */
Gui.Epg.Controller.Broadcasts.List.prototype.addObserver = function () {

    $(document).on('broadcastsloaded-'+this.data.channel_id, $.proxy(this.iterateBroadcasts, this));

    $(document).on('epg.scroll', $.proxy(this.handleScroll, this));

    $(window).on('orientationchange', $.proxy(this.handleResize, this));

    $(window).on('resize', $.proxy(this.handleResize, this));
};

Gui.Epg.Controller.Broadcasts.List.prototype.removeObserver = function () {

    $(document).off('broadcastsloaded-'+this.data.channel_id);

    $(document).off('epg.scroll', $.proxy(this.handleScroll, this));

    $(window).off('orientationchange', $.proxy(this.handleResize, this));

    $(window).off('resize', $.proxy(this.handleResize, this));
};

Gui.Epg.Controller.Broadcasts.List.prototype.iterateBroadcasts = function (collection) {

    var isInView = this.isInView(), me = this;

    collection.iterate($.proxy(function (dataModel) {

        this.broadcasts.push(this.module.getController('Broadcasts.List.Broadcast', {
            'channel' : dataModel.data.channel,
            'id' : dataModel.data.id,
            "parent" : this,
            "dataModel" : dataModel
        }));

        if (isInView) {

            this.broadcasts[this.broadcasts.length -1].dispatchView();
        } else {
            // TODO: stack erstellen, der abgearbeitet wird, statt in update list immer alle durch zu gehen.
//                this.toRender.push(me.broadcasts[me.broadcasts.length -1]);
        }
    }, this));
    // runs in endless loop if previous collection had items but current not
    // trigger update ONLY if collection.length is not 0!!!
    if (collection.collection.length > 0 && isInView) {

        this.updateList.call(me);
    }

};

Gui.Epg.Controller.Broadcasts.List.prototype.handleScroll = function () {

    var me = this;

    !!this.scrollTimeout && clearTimeout(this.scrollTimeout);

    this.scrollTimeout = setTimeout(function () {

        me.updateList.call(me);

    }, 200);
};

Gui.Epg.Controller.Broadcasts.List.prototype.handleResize = function () {

    this.view.isRendered && this.updateList.call(this);
};

/**
 * update list items if list is in view
 */
Gui.Epg.Controller.Broadcasts.List.prototype.updateList = function () {

    var i = 0,
        l = this.broadcasts.length,
        metrics,
        vOffset;

    if (this.isInView()) {

        metrics = this.epgController.getMetrics();
        vOffset = this.view.node.offset();

        for (i; i < l; i++) {

            // dispatch broadcast if is not but should be
            if (!this.broadcasts[i].view.isRendered
                && this.broadcasts[i].view.getLeft() + vOffset.left < metrics.win.width
            ) {

                this.broadcasts[i].dispatchView();
            }
        }

        if (l > 0) {

            // load next events
            if (this.broadcasts[l-1].view.getLeft() + vOffset.left < metrics.win.width) {

                this.getBroadcasts();
            }

            // adjust width of parentView
            if (this.epgController.getBroadcasts().node.width() - metrics.win.width < this.broadcasts[l-1].view.getRight() ) {

                this.epgController.getBroadcasts().node.width(metrics.win.width + this.broadcasts[l-1].view.getRight());
            }
        }
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
        metrics = this.epgController.getMetrics();

    return top < metrics.win.height && bottom > metrics.broadcasts.top;

};

Gui.Epg.Controller.Broadcasts.List.prototype.destructView = function () {

    var i= 0, l=this.broadcasts.length;

    for (i;i<l;i++) {

        this.broadcasts[i].destructView();
    }

    VDRest.Abstract.Controller.prototype.destructView.call(this);
};
