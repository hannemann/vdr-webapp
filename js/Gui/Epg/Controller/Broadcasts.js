
Gui.Epg.Controller.Broadcasts = function () {};

Gui.Epg.Controller.Broadcasts.prototype = new VDRest.Abstract.Controller();

Gui.Epg.Controller.Broadcasts.prototype.init = function () {

    this.view = this.module.getView('Broadcasts');
    this.view.setParentView(this.data.parent.view);
    this.broadcastLists = [];
    this.dataModel = VDRest.app.getModule('VDRest.Epg').getModel('Channels');
};

Gui.Epg.Controller.Broadcasts.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();

    if (this.dataModel.getCollection().length) {
        this.iterateChannels({
            "iterate" : $.proxy(this.dataModel.collectionIterator, this.dataModel)
        });
    }
};

Gui.Epg.Controller.Broadcasts.prototype.addObserver = function () {

    $(document).one('channelsloaded', $.proxy(this.iterateChannels, this));

    $(this.view.wrapper).on('scroll', this.handleScroll);
};

Gui.Epg.Controller.Broadcasts.prototype.removeObserver = function () {

    $(this.view.wrapper).off('scroll', this.handleScroll);
};

Gui.Epg.Controller.Broadcasts.prototype.handleScroll = function () {

    $.event.trigger({
        "type" : "epg.scroll"
    });
};

Gui.Epg.Controller.Broadcasts.prototype.iterateChannels = function (collection) {

    collection.iterate($.proxy(function (channelModel) {

        this.broadcastLists.push(this.module.getController('Broadcasts.List', {
            "channel_id" : channelModel.data.channel_id,
            "parent" : this,
            "dataModel" : channelModel
        }));

    }, this));

    this.dispatchChannels();
};

Gui.Epg.Controller.Broadcasts.prototype.dispatchChannels = function () {

    var i= 0, l=this.broadcastLists.length;

    for (i;i<l;i++) {

        this.broadcastLists[i].dispatchView();
    }
};

Gui.Epg.Controller.Broadcasts.prototype.destructView = function () {

    var i= 0, l=this.broadcastLists.length;

    for (i;i<l;i++) {

        this.broadcastLists[i].destructView();
    }

    VDRest.Abstract.Controller.prototype.destructView.call(this);
};