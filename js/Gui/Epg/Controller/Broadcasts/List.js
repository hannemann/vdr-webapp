
Gui.Epg.Controller.Broadcasts.List = function () {};

Gui.Epg.Controller.Broadcasts.List.prototype = new VDRest.Abstract.Controller();

Gui.Epg.Controller.Broadcasts.List.prototype.cacheKey = 'channel_id';

Gui.Epg.Controller.Broadcasts.List.prototype.init = function () {

    this.view = this.module.getView('Broadcasts.List', {
        "channel_id" : this.data.channel_id
    });
    this.view.setParentView(this.data.parent.view);

    this.addObserver();
};

Gui.Epg.Controller.Broadcasts.List.prototype.dispatchView = function () {

    this.module.store.getModel('Channels.Channel', {
        "channel_id" : this.data.channel_id
    }).getNextBroadcasts();

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
};

Gui.Epg.Controller.Broadcasts.List.prototype.addObserver = function () {

    $(document).on('broadcastsloaded-'+this.data.channel_id, $.proxy(function (collection) {

        collection.iterate($.proxy(function (dataModel) {

            this.module.getController('Broadcasts.List.Broadcast', {
                'channel' : dataModel.data.channel,
                'id' : dataModel.data.id,
                "parent" : this,
                "dataModel" : dataModel
            }).dispatchView();

        }, this));

    }, this));

};