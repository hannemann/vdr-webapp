
Gui.Epg.Controller.Broadcasts = function () {};

Gui.Epg.Controller.Broadcasts.prototype = new VDRest.Abstract.Controller();

Gui.Epg.Controller.Broadcasts.prototype.init = function () {

    this.view = this.module.getView('Broadcasts');
    this.view.setParentView(this.data.parent.view);
    this.addScrollEvents();
    this.addObserver();
};

Gui.Epg.Controller.Broadcasts.prototype.addObserver = function () {

    $(document).one('channelsloaded', $.proxy(function (collection) {

        collection.iterate($.proxy(function (channelModel) {

            this.module.getController('Broadcasts.List', {
                "channel_id" : channelModel.data.channel_id,
                "parent" : this,
                "dataModel" : channelModel
            }).dispatchView();

        }, this));
    }, this));
};

Gui.Epg.Controller.Broadcasts.prototype.addScrollEvents = function () {

    $(this.view.wrapper).on('scroll', function () {

        $.event.trigger({
            "type" : "epg.scroll",
            "direction" : "horizontal"
        });
    });
};