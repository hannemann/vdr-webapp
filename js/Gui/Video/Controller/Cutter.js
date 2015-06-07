Gui.Video.Controller.Cutter = function () {
};

Gui.Video.Controller.Cutter.prototype = new VDRest.Abstract.Controller();

Gui.Video.Controller.Cutter.prototype.init = function () {

    this.view = this.module.getView('Cutter', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);

    this.view.setParentView({
        "node": this.data.parent.view.node
    });
};


Gui.Video.Controller.Cutter.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
};