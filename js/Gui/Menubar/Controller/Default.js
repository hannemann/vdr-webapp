
Gui.Menubar.Controller.Default = function () {};

Gui.Menubar.Controller.Default.prototype = new VDRest.Abstract.Controller();

Gui.Menubar.Controller.Default.prototype.init = function () {

    var parentView = {"node":$('body')};

    this.view = this.module.getView('Default');

    this.view.setParentView(parentView);

    this.addObserver();

    $.event.trigger('menubar.init');
};

Gui.Menubar.Controller.Default.prototype.addObserver = function () {

    var me = this;
    $(document).on('epg.dispatched', function () {

        me.view.showEpgWrapper();
    });

    $(document).on('epg.date.changed', function (e) {

        me.view.setEpgDate(e.date);
    })
};