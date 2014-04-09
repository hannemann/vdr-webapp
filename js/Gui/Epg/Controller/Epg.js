
Gui.Epg.Controller.Epg = function () {};

Gui.Epg.Controller.Epg.prototype = new VDRest.Abstract.Controller();

Gui.Epg.Controller.Epg.prototype.init = function () {

    this.view = this.module.getView('Epg');

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );

    this.channels = this.module.getController('Channels', {"parent":this});

    this.broadcasts = this.module.getController('Broadcasts', {"parent":this});

};

Gui.Epg.Controller.Epg.prototype.dispatchView = function () {

    this.module.store.initChannels();
    this.channels.dispatchView();
    this.broadcasts.dispatchView();
    this.addScrollEvents();
    this.addObserver();

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
};

Gui.Epg.Controller.Epg.prototype.addScrollEvents = function () {

    $(this.view.node).on('scroll', function () {

        $.event.trigger({
            "type" : "epg.scroll",
            "direction" : "vertical"
        });
    });
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

Gui.Epg.Controller.Epg.prototype.getMetrics = function () {

    if (!this.metrics) {

        this.setMetrics();
    }
    return this.metrics;
};

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

Gui.Epg.Controller.Epg.prototype.addObserver = function () {

    $(window).on('orientationchange', $.proxy(this.setMetrics, this));
};
