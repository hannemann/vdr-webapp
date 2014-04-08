
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

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
};