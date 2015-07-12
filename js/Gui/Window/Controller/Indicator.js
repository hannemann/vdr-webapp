Gui.Window.Controller.Indicator = function () {
};

Gui.Window.Controller.Indicator.prototype = new VDRest.Abstract.Controller();

Gui.Window.Controller.Indicator.prototype.noHistory = true;

Gui.Window.Controller.Indicator.prototype.init = function () {

    this.view = this.module.getView('Indicator', this.data);

    this.view.parentView = {
        "node": document.body
    }
};

Gui.Window.Controller.Indicator.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    $window.one(this.data.destructTrigger, this.destructView.bind(this));
};

Gui.Window.Controller.Indicator.prototype.destructView = function () {

    this.view.node.one(this.transitionEndEvents, function () {
        this.module.cache.flushByClassKey(this);
        VDRest.Abstract.Controller.prototype.destructView.call(this);
    }.bind(this));

    this.view.hide();
};
