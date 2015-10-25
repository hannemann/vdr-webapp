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
        "parent" : this,
        "query" : this.data.query
    });

    this.broadcasts = this.module.getController('Broadcasts', {
        "parent" : this
    });

    this.view = this.module.getView('Search');

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );
};

/**
 * reinitialize form with resource data
 * @param {VDRest.SearchTimer.Model.List.SearchTimer} resource
 */
Gui.EpgSearch.Controller.Search.prototype.reInitForm = function (resource) {

    this.destroyContent();

    this.form = this.module.getController('Search.Form', {
        "parent" : this,
        "resource" : resource
    });

    this.broadcasts = this.module.getController('Broadcasts', {
        "parent" : this
    });

    this.dispatchContent();
};

/**
 * dispatch
 */
Gui.EpgSearch.Controller.Search.prototype.dispatchView = function () {

    this.dispatchContent();

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    this.preventReload();
};

/**
 * dispatch content
 */
Gui.EpgSearch.Controller.Search.prototype.dispatchContent = function () {

    this.form.dispatchView();
    this.broadcasts.dispatchView();
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
 * destroy contents
 */
Gui.EpgSearch.Controller.Search.prototype.destroyContent = function () {

    this.form.destructView();
    this.broadcasts.destructView();

    this.module.cache.invalidateClasses('Search.Form');
    this.module.cache.invalidateClasses('Broadcasts');
};

/**
 * destruct
 */
Gui.EpgSearch.Controller.Search.prototype.destructView = function () {

    this.form.destructView();
    this.broadcasts.destructView();

    VDRest.Abstract.Controller.prototype.destructView.call(this);
};
