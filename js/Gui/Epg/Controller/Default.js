
Gui.Epg.Controller.Default = function () {};

Gui.Epg.Controller.Default.prototype = new VDRest.Abstract.Controller();

Gui.Epg.Controller.Default.prototype.dispatchView = function (epg) {

    return this.module.getView('Default').render();
};