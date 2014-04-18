
Gui.Window.Controller.Confirm = function () {};

Gui.Window.Controller.Confirm.prototype = new Gui.Window.Controller.Input();

Gui.Window.Controller.Input.prototype.cacheKey = 'id';

Gui.Window.Controller.Confirm.prototype.init = function () {

    this.eventPrefix = 'window.confirm';

    this.view = this.module.getView('Confirm', this.data);

    Gui.Window.Controller.Input.prototype.init.call(this);
};

Gui.Window.Controller.Input.prototype.addObserver = function () {

    this.view.ok.on('click', $.proxy(this.ok, this));

    this.view.cancel.on('click', $.proxy(this.cancel, this));

    $(window).on("resize", $.proxy(this.setPosition, this));
};

Gui.Window.Controller.Input.prototype.ok = function () {

    $.event.trigger({
        "type" : "window.confirm.confirm"
    });

    history.back();
};