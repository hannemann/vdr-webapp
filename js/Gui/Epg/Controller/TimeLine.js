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

    this.addObserver();

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
};

Gui.Epg.Controller.TimeLine.prototype.addObserver = function () {

    var me = this,
        broadcastsWrapper = this.module.getController('Broadcasts').view.wrapper.get(0),
        epgController = this.module.getController('Epg');

    this.menubarDate = null;

    $(document).on('epg.scroll', function () {

        var scroll = broadcastsWrapper.scrollLeft * -1,
            ddOffset = broadcastsWrapper.offsetLeft,
            date = me.view.node.find('*[data-date]:first').attr('data-date');

        me.view.node.css({"left": scroll + 'px'});

        me.view.node.find('*[data-date]').each(function (k, v) {
            var d = $(v);

            if (d.offset().left + d.width() <= ddOffset) {

                date = d.attr('data-date');
            } else {
                return false;
            }
        });

        if (date !== me.menubarDate) {
            $.event.trigger({
                "type" : "epg.date.changed",
                "date" : new Date(parseInt(date, 10))
            });
            me.menubarDate = date;
        }

        if (me.view.node.find('div:last').offset().left < epgController.getMetrics().win.width) {

            me.view.renderTimeLine();
        }
    });

};