/**
 * @class
 * @constructor
 */
Gui.EpgSearch.Controller.Search = function () {};

/**
 * @type {Gui.Epg.Controller.Broadcasts}
 */
Gui.EpgSearch.Controller.Search.prototype = new Gui.Epg.Controller.Broadcasts();

/**
 * initialize list
 */
Gui.EpgSearch.Controller.Search.prototype.init = function () {

    this.form = this.module.getController('Search.Form', {
        "parent" : this
    });

    this.broadcasts = this.module.getController('Broadcasts', {
        "parent" : this
    });

    this.view = this.module.getView('Search', {
        "form" : this.form
    });

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );
};

/**
 * dispatch
 */
Gui.EpgSearch.Controller.Search.prototype.dispatchView = function () {

    this.form.dispatchView();
    this.broadcasts.dispatchView();

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    this.preventReload();
};

/**
 * overwrite method of parent class since observers shall not be removed
 * from epg since its never getting destroyed!!!
 *
 * DON'T REMOVE THIS METHOD!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * broadcastsloaded event will never trigger otherwise!!!!!!!!!!!!!!!!!!!
 */
Gui.EpgSearch.Controller.Search.prototype.removeObserver = function () {};

/**
 * destruct
 */
Gui.EpgSearch.Controller.Search.prototype.destructView = function () {

    this.form.destructView();
    this.broadcasts.destructView();

    VDRest.Abstract.Controller.prototype.destructView.call(this);
};
