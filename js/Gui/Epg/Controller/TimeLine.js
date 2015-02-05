/**
 * @class
 * @constructor
 */
Gui.Epg.Controller.TimeLine = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Epg.Controller.TimeLine.prototype = new VDRest.Abstract.Controller();

/**
 * get start date object and initialize view
 */
Gui.Epg.Controller.TimeLine.prototype.dispatchView = function () {

    this.from = this.module.store[VDRest.config.getItem('lastEpg')];

    this.view = this.module.getView('TimeLine');

    this.node = this.view.node.get(0);

    this.view.setParentView(this.data.parent.view);

    this.module.getViewModel('TimeLine', {
        "view" : this.view,
        "from" : this.from
    });


    this.broadcastsWrapper = this.module.getController('Broadcasts').view.wrapper.get(0);
    this.epgController = this.module.getController('Epg');
    this.currentDate = this.view.node.find('*[data-date]:first').attr('data-date');

    this.addObserver();

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
};

/**
 * add observer
 */
Gui.Epg.Controller.TimeLine.prototype.addObserver = function () {

    this.menubarDate = null;

};

/**
 * remove observer
 */
Gui.Epg.Controller.TimeLine.prototype.removeObserver = function () {

};

/**
 * handle scroll events
 * @param {{x: Number, y: Number, jsStyle: String}|Event} [e]
 */
Gui.Epg.Controller.TimeLine.prototype.handleScroll = function (e) {

    var scroll = e.x ? e.x : this.broadcastsWrapper.scrollLeft * -1,
        ddOffset = this.broadcastsWrapper.offsetLeft, me = this;

    e = e || {};

    if (this.view.node.is(':visible')) {

        e.jsStyle = e.jsStyle || TouchMove.Helper.getTransformVendorPrefix(this.node).jsStyle;

        this.node.style[e.jsStyle] = "translateX(" + scroll + "px)";

        this.view.node.find('*[data-date]').each(function (k, v) {
            var d = $(v);

            if (d.offset().left + d.width() <= ddOffset) {

                me.currentDate = d.attr('data-date');
            } else {
                return false;
            }
        });

        if (this.currentDate && this.currentDate !== this.menubarDate) {

            this.view.setDate(new Date(parseInt(this.currentDate, 10)));
            this.menubarDate = this.currentDate;
        }

        if (this.view.node.find('div:last').offset().left < this.epgController.getMetrics().win.width) {

            this.view.renderTimeLine();
        }
    }
};