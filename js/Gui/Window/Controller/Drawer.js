
Gui.Window.Controller.Drawer = function () {};

Gui.Window.Controller.Drawer.prototype = new Gui.Window.Controller.Abstract();

Gui.Window.Controller.Drawer.prototype.isDispatched = false;

Gui.Window.Controller.Drawer.prototype.init = function () {

    this.eventPrefix = 'window.drawer';

    this.view = this.module.getView('Drawer', this.data);

    this.module.getViewModel('Drawer', {
        "view" : this.view
    });

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

Gui.Window.Controller.Drawer.prototype.dispatchView = function () {

    if (!this.isDispatched) {

        this.isDispatched = true;

        Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

        this.addObserver();
    }
};

Gui.Window.Controller.Drawer.prototype.addObserver = function () {

    var i = 0, l = this.view.buttons.length;

    for (i; i<l; i++) {

        if (!this.view.buttons[i].hasClass('current')) {

            this.view.buttons[i].one('click', function () {

                var that = this;
                $(document).one('drawer.dispatched', function (e) {

                    if (e.payload) {

                        $(document).one('click', function () {

                            history.back();
                        });
                    }

                    VDRest.app.dispatch($(that).attr('data-module'));
                });
            });
        }
    }
    $(document).one('drawer.dispatched', function (e) {

        if (e.payload) {

            $(document).one('click', function () {

                history.back();
            });
        }
    });
};

Gui.Window.Controller.Drawer.prototype.removeObserver = function () {

};

//Gui.Window.Controller.Drawer.prototype.destructView = function () {
//
//    Gui.Window.Controller.Abstract.prototype.destructView.call(this);
//};