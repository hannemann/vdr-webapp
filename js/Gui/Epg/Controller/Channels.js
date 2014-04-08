
Gui.Epg.Controller.Channels = function () {};

Gui.Epg.Controller.Channels.prototype = new VDRest.Abstract.Controller();

Gui.Epg.Controller.Channels.prototype.init = function () {

    this.view = this.module.getView('Channels');
    this.view.setParentView(this.data.parent.view);
    this.addObserver();
};

Gui.Epg.Controller.Channels.prototype.addObserver = function () {

    $(document).one('channelsloaded', $.proxy(function (collection) {

        collection.iterate($.proxy(function (channelModel) {

            this.module.getController('Channels.Channel', {
                "channel_id" : channelModel.data.channel_id,
                "parent" : this,
                "dataModel" : channelModel
            }).dispatchView();

        }, this));
    }, this));
};