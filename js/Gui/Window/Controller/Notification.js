Gui.Window.Controller.Notification = function () {
};

Gui.Window.Controller.Notification.prototype = new VDRest.Abstract.Controller();

Gui.Window.Controller.Notification.prototype.init = function () {

    this.view = this.module.getView('Notification', this.data);

    this.view.parentView = {
        "node": document.body
    }
};

Gui.Window.Controller.Notification.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    setTimeout(function () {
        this.destructView();
    }.bind(this), 5000);
};

Gui.Window.Controller.Notification.prototype.destructView = function () {

    this.view.node.one(this.transitionEndEvents, function () {
        this.module.cache.flushByClassKey(this);
        VDRest.Abstract.Controller.prototype.destructView.call(this);
    }.bind(this));

    this.view.hide();
};
