
Gui.Viewport.Controller.Default = function () {};

Gui.Viewport.Controller.Default.prototype = new VDRest.Abstract.Controller();

Gui.Viewport.Controller.Default.prototype.init = function () {

    this.view = this.module.getView('Default');
};