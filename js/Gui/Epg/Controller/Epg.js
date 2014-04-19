/**
 * @typedef win
 * @type {object}
 * @property {number} width
 * @property {number} height
 *
 * @typedef viewPort
 * @type {object}
 * @property {number} width
 * @property {number} height
 * @property {number} top
 * @property {number} left
 *
 * @typedef broadcasts
 * @type {object}
 * @property {number} width
 * @property {number} height
 * @property {number} top
 * @property {number} left
 */

/**
 * @class
 * @constructor
 * @var {object} metrics
 * @property {object} win
 * @property {object} viewPort
 * @property {object} broadcasts
 */
Gui.Epg.Controller.Epg = function () {};

/**
 * @type {VDRest.Lib.Cache.store.Controller}
 */
Gui.Epg.Controller.Epg.prototype = new VDRest.Abstract.Controller();

/**
 * @type {boolean}
 */
Gui.Epg.Controller.Epg.prototype.isChannelView = false;

/**
 * retrieve epg items
 */
Gui.Epg.Controller.Epg.prototype.init = function () {

    this.view = this.module.getView('Epg');

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );

    this.timeLine = this.module.getController('TimeLine', {"parent":this});

    this.channels = this.module.getController('Channels', {"parent":this});

    this.broadcasts = this.module.getController('Broadcasts', {"parent":this});
};

/**
 * dispatch views, init event handling
 */
Gui.Epg.Controller.Epg.prototype.dispatchView = function () {

    if (this.isHidden) {

        this.view.node.show();

        this.isHidden = false;

    } else {

        VDRest.Abstract.Controller.prototype.dispatchView.call(this);

        this.timeLine.dispatchView();
        this.channels.dispatchView();
        this.broadcasts.dispatchView();
        this.addObserver();

        $.event.trigger('epg.dispatched');

        this.module.store.initChannels();

    }
};

/**
 * retrieve viewport view
 * @returns {VDRest.Abstract.View|*}
 */
Gui.Epg.Controller.Epg.prototype.getViewPort = function () {

    if (!this.viewportView) {
        this.viewportView = VDRest.app.getModule('Gui.Viewport').getView('Default')
    }

    return this.viewportView;
};

/**
 * retrieve broadcasts view
 * @returns {*}
 */
Gui.Epg.Controller.Epg.prototype.getBroadcasts = function () {

    if (!this.broadcastsView) {

        this.broadcastsView = this.module.getView('Broadcasts');
    }
    return this.broadcastsView;
};

/**
 * retrieve metrics of relevant dom objects
 * @returns {object} metrics
 */
Gui.Epg.Controller.Epg.prototype.getMetrics = function () {

    if (!this.metrics) {

        this.setMetrics();
    }
    return this.metrics;
};

/**
 * set metrics object
 */
Gui.Epg.Controller.Epg.prototype.setMetrics = function () {

    var viewPort = this.getViewPort().node,
        vOffset = viewPort.offset(),
        broadcasts = this.getBroadcasts().node,
        bOffset = broadcasts.offset();

    this.metrics = {
        "win" : {
            "width": $(window).width(),
            "height": $(window).height()
        },
        "viewPort" : {
            "top" : vOffset.top,
            "left" : vOffset.left,
            "width" : viewPort.width(),
            "height" : viewPort.height()
        },
        "broadcasts" : {
            "top" : bOffset.top,
            "left" : bOffset.left,
            "width" : broadcasts.width(),
            "height" : broadcasts.height()
        }
    };
};

/**
 * toggle channelview
 * @param {jQuery.Event} e
 * @returns {Gui.Epg.Controller.Epg}
 */
Gui.Epg.Controller.Epg.prototype.setIsChannelView = function (e) {

    var channels;

    if (e.payload instanceof Gui.Epg.Controller.Channels.Channel) {

        channels = this.module.getController('Channels');
        channels.saveState();
        channels.view.node.css({"top":0});
        this.module.getController('Broadcasts').saveState();
        this.view.node.addClass('channel-view');
        this.isChannelView = true;

    } else {

        this.view.node.removeClass('channel-view');
        this.isChannelView = false;
        this.module.getController('Channels').recoverState();
        this.module.getController('Broadcasts').recoverState();
    }

    return this;
};

/**
 * determine is channelview
 * @returns {boolean|*}
 */
Gui.Epg.Controller.Epg.prototype.getIsChannelView = function () {

    return this.isChannelView;
};

/**
 * add handler to orientationchange and resize evente
 */
Gui.Epg.Controller.Epg.prototype.addObserver = function () {

    $(window).on('orientationchange', $.proxy(this.setMetrics, this));
    $(window).on('resize', $.proxy(this.setMetrics, this));
    $(document).on('epg.channelview', $.proxy(this.setIsChannelView, this));
};

/**
 * remove handler from orientationchange and resize evente
 */
Gui.Epg.Controller.Epg.prototype.removeObserver = function () {

    $(window).off('orientationchange', $.proxy(this.setMetrics, this));
    $(window).off('resize', $.proxy(this.setMetrics, this));
    $(document).off('epg.channelview', $.proxy(this.setIsChannelView, this));
};

/**
 * destroy!
 */
Gui.Epg.Controller.Epg.prototype.destructView = function () {

    this.view.node.hide();

    this.isHidden = true;

//    this.timeLine.destructView();
//    this.channels.destructView();
//    this.broadcasts.destructView();
//
//    VDRest.Abstract.Controller.prototype.destructView.call(this);
};