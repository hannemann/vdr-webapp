
Gui.Epg.Controller.Channels = function () {};

Gui.Epg.Controller.Channels.prototype = new VDRest.Abstract.Controller();

Gui.Epg.Controller.Channels.prototype.dispatchView = function () {

    return this.module.getView('Channels')
        .render();
};