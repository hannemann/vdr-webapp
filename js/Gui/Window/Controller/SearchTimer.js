/**
 * @class
 * @constructor
 */
Gui.Window.Controller.SearchTimer = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.Controller.SearchTimer.prototype = new Gui.Window.Controller.Abstract();

/**
 * @type {string}
 */
Gui.Window.Controller.SearchTimer.prototype.cacheKey = 'id';

/**
 * init view and view model
 */
Gui.Window.Controller.SearchTimer.prototype.init = function () {

    this.eventPrefix = 'window.searchtimer-' + this.data.id;

    this.eventNameSpace = this.module.namespace + '-' + this.module.name;

    this.view = this.module.getView('SearchTimer', this.data);

    this.module.getViewModel('SearchTimer', {
        "id" : this.data.id,
        "view" : this.view,
        "resource": this.data.resource.data
    });

    Gui.Window.Controller.Abstract.prototype.init.call(this);

    VDRest.helper.log(this);
};

Gui.Window.Controller.SearchTimer.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    this.requestSearchForm();
};


/**
 * trigger search form
 */
Gui.Window.Controller.SearchTimer.prototype.requestSearchForm = function () {

    var config = this.view.getSearchFormData();

    $.event.trigger({
        "type": "form.request",
        "config": {
            "parentView": {
                "node": this.view.body
            },
            "reference": "searchTimerForm",
            "cacheKey": this.cacheKey,
            "keyInCache": this.keyInCache,
            "id": this.data.id,
            "catConfig": config.categories,
            "fields": config.fields,
            "className": "searchtimer",
            "onsubmit": this.data.onsubmit,
            "buttonContainer": this.view.node,
            "container": this.view.node
        }
    });
};

/**
 * Destroy
 */
Gui.Window.Controller.SearchTimer.prototype.destructView = function () {

    var me = this;

    // apply animation
    this.view.node.toggleClass('collapse expand');
    // remove on animation end
    this.view.node.one(this.animationEndEvents, function () {

        Gui.Window.Controller.Abstract.prototype.destructView.call(me);
    });
};