
Gui.Epg.Controller.Channels = function () {};

Gui.Epg.Controller.Channels.prototype = new VDRest.Abstract.Controller();

Gui.Epg.Controller.Channels.prototype.init = function () {

    this.view = this.module.getView('Channels');
    this.view.setParentView(this.data.parent.view);
};
Gui.Epg.Controller.Channels.prototype.dispatchView = function () {

    var me = this;

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    $(document).one('epg.dispatched', function () {
        me.addObserver();
    });
};
Gui.Epg.Controller.Channels.prototype.addObserver = function () {

    var me = this,
        broadcastsWrapper = this.module.getController('Broadcasts').view.wrapper.get(0),
        offsetTop = parseInt(this.view.node.css('top'), 10);

    $(document).one('channelsloaded', $.proxy(function (collection) {

        collection.iterate($.proxy(function (channelModel) {

            this.module.getController('Channels.Channel', {
                "channel_id" : channelModel.data.channel_id,
                "parent" : this,
                "dataModel" : channelModel
            }).dispatchView();

        }, this));
    }, this));

    $(document).on('epg.scroll', function () {

        var scroll = broadcastsWrapper.scrollTop * -1;

        me.view.node.css({"top": scroll + offsetTop + 'px'});
    });
};