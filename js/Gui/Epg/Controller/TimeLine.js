/**
 * @class
 * @constructor
 */
Gui.Epg.Controller.TimeLine = function () {};

/**
 * @type {VDRest.Lib.Cache.store.Controller}
 */
Gui.Epg.Controller.TimeLine.prototype = new VDRest.Abstract.Controller();

/**
 * get start date object and initialize view
 */
Gui.Epg.Controller.TimeLine.prototype.dispatchView = function () {

    this.from = this.module.store[VDRest.config.getItem('lastEpg')];

    this.view = this.module.getView('TimeLine');

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

    $(document).on('epg.scroll', $.proxy(this.handleScroll, this));

};

/**
 * remove observer
 */
Gui.Epg.Controller.TimeLine.prototype.removeObserver = function () {

    $(document).off('epg.scroll', $.proxy(this.handleScroll, this));

};

/**
 * handle scroll events
 */
Gui.Epg.Controller.TimeLine.prototype.handleScroll = function () {

    var scroll = this.broadcastsWrapper.scrollLeft * -1,
        ddOffset = this.broadcastsWrapper.offsetLeft, me = this;

    this.view.node.css({"left": scroll + 'px'});

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
};