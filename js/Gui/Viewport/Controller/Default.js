
Gui.Viewport.Controller.Default = function () {};

Gui.Viewport.Controller.Default.prototype = new VDRest.Abstract.Controller();

Gui.Viewport.Controller.Default.prototype.dispatchView = function () {

    var view = this.module.getView('Default').render();
};