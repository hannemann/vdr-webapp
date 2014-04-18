/**
 * @class
 * @constructor
 */
Gui.Tabs.Controller.Abstract = function () {};

/**
 * @type {VDRest.Lib.Cache.store.Controller}
 */
Gui.Tabs.Controller.Abstract.prototype = new VDRest.Abstract.Controller();

/**
 * init parentView
 */
Gui.Tabs.Controller.Abstract.prototype.init = function () {

    this.view = this.module.getView('Abstract', this.data);

    this.addObserver();
};
/**
 * init parentView
 */
Gui.Tabs.Controller.Abstract.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    this.addDomEvents();
};

/**
 * add event handler
 * add destroyer to VDRest.app
 */
Gui.Tabs.Controller.Abstract.prototype.addObserver = function () {

    var me = this;

    $(document).one("destruct.window-" + this.data.keyInCache, function () {

        me.view.destruct();
        me.module.cache.flushByClassKey(me);
    });
};

/**
 * add events
 */
Gui.Tabs.Controller.Abstract.prototype.addDomEvents = function () {

    var me = this;

    this.view.tabs.find('li').each(function (k) {

        var that = $(this);

        that.on('click', function () {

            if (that.hasClass('current')) {

                return;
            }

            me.view.setCurrent(k);

        });

    });
};
