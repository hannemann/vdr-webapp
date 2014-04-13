Gui.Config.Controller.Settings = function () {};

Gui.Config.Controller.Settings.prototype = new VDRest.Abstract.Controller();

Gui.Config.Controller.Settings.prototype.init = function () {

    VDRest.app.getModule('Gui.Menubar').getView('Default').setTitle(this.module.name);
    VDRest.app.getModule('Gui.Viewport').getView('Default').node.addClass(this.module.name.toLowerCase());

    this.view = this.module.getView('Settings');
    this.view.setParentView(VDRest.app.getModule('Gui.Viewport').getView('Default'));

    this.module.getViewModel('Settings', {
        "view" : this.view
    });
};

Gui.Config.Controller.Settings.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

Gui.Config.Controller.Settings.prototype.addObserver = function () {

    var i;

    for (i in this.view.fields) {

        if (this.view.fields.hasOwnProperty(i) && this.view.fields[i].hasOwnProperty('dom')) {

            this.view.fields[i].dom.on('click', $.proxy(this.requestInput, this));
        }
    }
};

Gui.Config.Controller.Settings.prototype.removeObserver = function () {

    var i;

    for (i in this.view.fields) {

        if (this.view.fields.hasOwnProperty(i) && this.view.fields[i].hasOwnProperty('dom')) {

            this.view.fields[i].dom.off('click', $.proxy(this.requestInput, this));
        }
    }
};

Gui.Config.Controller.Settings.prototype.requestInput = function (e) {

    e.preventDefault();

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "type" : "Input",
            "data" : this.view.fields[e.currentTarget.id]
        }
    });
};