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
    this.channelsController = this.module.getController('Channels');
    this.timeLineController = this.module.getController('TimeLine');
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

    if (!VDRest.helper.touchMoveCapable) {
        this.view.wrapper.get(0).onscroll = $.proxy(this.handleScroll, this);
    }
};

/**
 * remove event listeners
 */
Gui.Epg.Controller.Broadcasts.prototype.removeObserver = function () {

    if (!VDRest.helper.touchMoveCapable) {
        $(this.view.wrapper).off('scroll', this.handleScroll);
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

Gui.Epg.Controller.Broadcasts.prototype.fnHandleScrollBroadcasts = function (e) {

    var i;

    for (i in this.broadcastLists) {
        if (this.broadcastLists.hasOwnProperty(i)) {

            this.broadcastLists[i].handleScroll(e);
        }
    }
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
 * DESTROY!
 */
Gui.Epg.Controller.Broadcasts.prototype.destructView = function () {

    var i= 0, l=this.broadcastLists.length;

    for (i;i<l;i++) {

        this.broadcastLists[i].destructView();
    }

    VDRest.Abstract.Controller.prototype.destructView.call(this);
};