
Gui.Window.Controller.Recording = function () {};

Gui.Window.Controller.Recording.prototype = new Gui.Window.Controller.Abstract();

Gui.Window.Controller.Recording.prototype.cacheKey = 'number';

Gui.Window.Controller.Recording.prototype.init = function () {

    this.eventPrefix = 'window.recording' + this.data.number;

    this.view = this.module.getView('Recording', this.data);

    this.module.getViewModel('Recording', {
        "number" : this.data.number,
        "view" : this.view,
        "resource" : this.data.resource
    });

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

Gui.Window.Controller.Recording.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    this.addObserver();
//    this.setPosition();
};

Gui.Window.Controller.Recording.prototype.addObserver = function () {

//    var me = this;

    Gui.Window.Controller.Abstract.prototype.addObserver.call(this);
};