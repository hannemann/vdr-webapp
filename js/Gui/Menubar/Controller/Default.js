/**
 * @class
 * @constructor
 */
Gui.Menubar.Controller.Default = function () {};

/**
 * @type {VDRest.Lib.Cache.store.Controller}
 */
Gui.Menubar.Controller.Default.prototype = new VDRest.Abstract.Controller();

/**
 * throbber counter
 * @type {number}
 */
Gui.Menubar.Controller.Default.prototype.throbberCalls = 0;

/**
 * defer click on icon
 * @type {boolean}
 */
Gui.Menubar.Controller.Default.prototype.deferIconClick = false;

/**
 * initialize
 */
Gui.Menubar.Controller.Default.prototype.init = function () {

    this.view = this.module.getView('Default');

    $(document).on('dispatch.after', $.proxy(this.view.setTitle, this.view));

    this.view.setParentView({"node":$('body')});

    this.drawerDispatched = false;

    $.event.trigger('menubar.init');
};

/**
 * call render, add observer
 */
Gui.Menubar.Controller.Default.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * show spinner in upper right corner
 * increase calls
 */
Gui.Menubar.Controller.Default.prototype.showThrobber = function () {

    if (this.throbberCalls === 0) {
        this.view.settingsButton.hide();
        this.view.throbber.show();
    }
    this.throbberCalls++;
};

/**
 * hide spinner in upper right corner
 * decrease calls
 */
Gui.Menubar.Controller.Default.prototype.hideThrobber = function (force) {

    this.throbberCalls--;
    if (this.throbberCalls <= 0 || force) {
        this.view.throbber.hide();
        this.view.settingsButton.show();
        this.throbberCalls = 0;
    }
};

/**
 * add events to elements
 */
Gui.Menubar.Controller.Default.prototype.addObserver = function () {

    var me = this, indicatorWidth = this.view.drawerIndicator.width();

    this.view.settingsButton.on('click', function () {

        VDRest.app.dispatch('Gui.Config');
    });

    $(document).on('drawer.dispatched', function (e) {

        me.drawerDispatched = !!e.payload;

        me.deferIconClick = false;
    });

    $(document).on('drawer.animate', function () {

        var target = Math.floor(indicatorWidth / 2);

        me.deferIconClick = true;

        if (me.drawerDispatched) {

            target = indicatorWidth;
        }
        me.view.drawerIndicator.animate({
            "width" : target + 'px'
        }, 'fast');
    });

    this.view.titleWrapper.on('click', function () {

        if (!me.deferIconClick) {

            if ("undefined" !== typeof me.initial) {

                me.initial = undefined;

                location.replace(
                    location.href.replace(/#.*$/, '#' + VDRest.config.getItem('start'))
                );

            } else if (me.drawerDispatched) {

                history.back()

            } else {

                if (!me.isStartPage()) {

                    history.back();

                } else {

                    $.event.trigger({
                        "type": 'window.request',
                        "payload": {
                            "type": "Drawer"
                        }
                    });

                }
            }
        }
    });

    $(document).on('dispatch.before', $.proxy(this.showThrobber, this));
    $(document).on('dispatch.after', $.proxy(function () {

        this.view.decorateIndicator(me.isStartPage());
        this.hideThrobber();
    }, this));
};

Gui.Menubar.Controller.Default.prototype.isStartPage = function () {

    return ( VDRest.config.getItem('start') === VDRest.app.getCurrent() ) || "undefined" !== typeof this.initial
};