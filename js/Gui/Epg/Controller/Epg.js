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
 * initialize components
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
        this.module.unMute();

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
 * recover from muted state
 */
Gui.Epg.Controller.Epg.prototype.recover = function () {

    var i, cache = this.module.cache.store.Controller['Broadcasts.List'];
    for (i in cache) {

        if (cache.hasOwnProperty(i)) {
            cache[i].handleScroll();
        }
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

    return this.broadcasts;
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
 * retrieve current scroll left
 * @returns {Number}
 */
Gui.Epg.Controller.Epg.prototype.getScrollLeft = function () {

    if (!VDRest.helper.isTouchDevice) {
        return this.broadcasts.view.wrapper.scrollLeft();
    } else {
        return this.broadcasts.touchScroll.slider.getState().x;
    }
};

/**
 * set metrics object
 */
Gui.Epg.Controller.Epg.prototype.setMetrics = function () {

    var viewPort = this.getViewPort().node,
        vOffset = viewPort.offset(),
        broadcasts = this.getBroadcasts(),
        bOffset = broadcasts.view.node.offset();

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
            "width" : broadcasts.view.node.width(),
            "height" : broadcasts.view.node.height()
        }
    };
};

/**
 * toggle channelview
 * @param {jQuery.Event} e
 * @returns {Gui.Epg.Controller.Epg}
 */
Gui.Epg.Controller.Epg.prototype.setIsChannelView = function (e) {

    var channels = this.module.getController('Channels');

    if (e.payload instanceof Gui.Epg.Controller.Channels.Channel) {

        channels.view.node.css({"top":0});
        this.view.node.addClass('channel-view');
        this.isChannelView = true;

        e.payload.view.scrollIntoView();

    } else {

        this.view.node.removeClass('channel-view');
        this.isChannelView = false;
        channels.view.node.css({"top":""});
        this.broadcasts.recoverState();
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

    $(window).on('orientationchange.epg-controller', this.handleOrientationChange.bind(this));
    $(window).on('resize', this.setMetrics.bind(this));
    $(document).on('epg.channelview', this.setIsChannelView.bind(this));
};

/**
 * remove handler from orientationchange and resize evente
 */
Gui.Epg.Controller.Epg.prototype.removeObserver = function () {

    $(window).off('orientationchange.epg-controller');
    $(window).off('resize');
    $(document).off('epg.channelview');
};

/**
 * handle orientation change
 */
Gui.Epg.Controller.Epg.prototype.handleOrientationChange = function () {

    if (!this.module.isMuted) {

        setTimeout($.proxy(function () {

            this.setMetrics();
            this.recover();
        }, this), 500);
    }
};

/**
 * destroy!
 */
Gui.Epg.Controller.Epg.prototype.destructView = function (hideOnly) {

    if (hideOnly) {

        this.view.node.hide();
        this.isHidden = true;
        this.module.mute();

    } else {

        this.timeLine.destructView();
        this.channels.destructView();
        this.broadcasts.destructView();

        VDRest.Abstract.Controller.prototype.destructView.call(this);
    }

};