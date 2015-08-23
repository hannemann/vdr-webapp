/**
 * @class
 * @constructor
 */
Gui.EpgSearch.Controller.Search.Form = function () {};

/**
 * @type {Gui.Epg.Controller.Broadcasts}
 */
Gui.EpgSearch.Controller.Search.Form.prototype = new VDRest.Abstract.Controller();

/**
 * initialize list
 */
Gui.EpgSearch.Controller.Search.Form.prototype.init = function () {

    this.view = this.module.getView('Search.Form');

    VDRest.app.getModule('Gui.SearchTimer').getViewModel('Window.SearchTimer', {
        "id" : -1,
        "view" : this.view,
        "resource": VDRest.app.getModule('VDRest.SearchTimer').getModel('List.SearchTimer', {"id" : -1})
    });
};

/**
 * initialize list
 */
Gui.EpgSearch.Controller.Search.Form.prototype.dispatchView = function () {

    this.view.setParentView(
        this.data.parent.view
    );

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
};

/**
 * destruct
 */
Gui.EpgSearch.Controller.Search.Form.prototype.destructView = function () {

    $.event.trigger({
        "type" : "destruct.form-Search"
    });

    VDRest.app.getModule('Gui.SearchTimer').cache.flush();

    VDRest.Abstract.Controller.prototype.destructView.call(this);
};