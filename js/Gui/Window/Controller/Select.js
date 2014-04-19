
Gui.Window.Controller.Select = function () {};

Gui.Window.Controller.Select.prototype = new Gui.Window.Controller.Input();

Gui.Window.Controller.Select.prototype.init = function () {

    this.eventPrefix = 'window.select';

    this.view = this.module.getView('Select', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

Gui.Window.Controller.Select.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    this.addObserver();
    this.setPosition();
};