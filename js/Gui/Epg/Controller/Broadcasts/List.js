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
};

/**
 * init listeners, fetch first items, dispatch
 */
Gui.Epg.Controller.Broadcasts.List.prototype.dispatchView = function () {

    this.addObserver();
    this.getBroadcasts();
    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
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

/**
 * add event listeners
 */
Gui.Epg.Controller.Broadcasts.List.prototype.addObserver = function () {

    var me = this;

    $(document).on('broadcastsloaded-'+this.data.channel_id, function (collection) {

        var isInView = me.isInView.call(me);

        collection.iterate(function (dataModel) {

            me.broadcasts.push(me.module.getController('Broadcasts.List.Broadcast', {
                'channel' : dataModel.data.channel,
                'id' : dataModel.data.id,
                "parent" : me,
                "dataModel" : dataModel
            }));

            if (isInView) {

                me.broadcasts[me.broadcasts.length -1].dispatchView();
            } else {
                // TODO: stack erstellen, der abgearbeitet wird, statt in update list immer alle durch zu gehen.
//                this.toRender.push(me.broadcasts[me.broadcasts.length -1]);
            }
        });
        // runs in endless loop if previous collection had items but current not
        // trigger update ONLY if collection.length is not 0!!!
        if (collection.collection.length > 0 && isInView) {
            me.updateList.call(me);
        }
    });

    $(document).on('epg.scroll', function () {

        !!me.scrollTimeout && clearTimeout(me.scrollTimeout);

        me.scrollTimeout = setTimeout(function () {

            me.updateList.call(me);

        }, 200);
    });

    $(window).on('orientationchange', function () {

        me.view.isRendered && me.updateList.call(me);
    });
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
