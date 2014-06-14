/**
 * @class
 * @constructor
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
};

/**
 * dispatch
 */
Gui.Epg.Controller.Broadcasts.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();

    if (this.dataModel.getCollection().length) {
        this.iterateChannels({
            "iterate" : $.proxy(this.dataModel.collectionIterator, this.dataModel)
        });
    }
};

/**
 * add event listeners
 */
Gui.Epg.Controller.Broadcasts.prototype.addObserver = function () {

    $(document).one('channelsloaded', $.proxy(this.iterateChannels, this));

    this.view.wrapper.get(0).onscroll = this.handleScroll;
};

/**
 * remove event listeners
 */
Gui.Epg.Controller.Broadcasts.prototype.removeObserver = function () {

    $(this.view.wrapper).off('scroll', this.handleScroll);
};

/**
 * handle scroll events
 */
Gui.Epg.Controller.Broadcasts.prototype.handleScroll = function () {

    $.event.trigger({
        "type" : "epg.scroll"
    });
};

/**
 * iterate channel list, buffer lists
 * @param collection
 */
Gui.Epg.Controller.Broadcasts.prototype.iterateChannels = function (collection) {

    collection.iterate($.proxy(function (channelModel) {

        if (!VDRest.config.getItem('showRadio') && channelModel.data.is_radio && channelModel.data.is_radio === true) {

            return true;
        }

        this.broadcastLists.push(this.module.getController('Broadcasts.List', {
            "channel_id" : channelModel.data.channel_id,
            "parent" : this,
            "dataModel" : channelModel
        }));

    }, this));

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
 * save current scroll position
 */
Gui.Epg.Controller.Broadcasts.prototype.saveState = function () {

    this.setData('scrollTop', this.view.wrapper.scrollTop());

    this.setData('scrollLeft', this.view.wrapper.scrollLeft());
};

/**
 * recover scroll position
 */
Gui.Epg.Controller.Broadcasts.prototype.recoverState = function () {

    this.view.wrapper.scrollTop(this.getData('scrollTop'));

    this.view.wrapper.scrollLeft(this.getData('scrollLeft'));
};

/**
 * DESTROY!
 */
Gui.Epg.Controller.Broadcasts.prototype.destructView = function () {

    var i= 0, l=this.broadcastLists.length;

    for (i;i<l;i++) {

        this.broadcastLists[i].destructView();
    }

    VDRest.Abstract.Controller.prototype.destructView.call(this);
};