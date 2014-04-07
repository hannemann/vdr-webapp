
Gui.Menubar.Controller.Default = function () {};

Gui.Menubar.Controller.Default.prototype = new VDRest.Abstract.Controller();

Gui.Menubar.Controller.Default.prototype.dispatchView = function () {

    this.module.getView('Default').render();
    $.event.trigger('menubar.init');
};