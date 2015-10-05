/**
 * @class
 * @constructor
 */
Gui.SearchTimer.Controller.Window.SearchTimer = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.SearchTimer.Controller.Window.SearchTimer.prototype = new Gui.Window.Controller.Abstract();

/**
 * @type {string}
 */
Gui.SearchTimer.Controller.Window.SearchTimer.prototype.cacheKey = 'id';

/**
 * init view and view model
 */
Gui.SearchTimer.Controller.Window.SearchTimer.prototype.init = function () {

    this.eventPrefix = 'window.searchtimer-' + this.data.id;

    this.eventNameSpace = this.module.namespace + '-' + this.module.name;

    this.view = this.module.getView('Window.SearchTimer', this.data);

    this.module.getViewModel('Window.SearchTimer', {
        "id" : this.data.id,
        "view" : this.view,
        "resource": this.data.resource
    });

    Gui.Window.Controller.Abstract.prototype.init.call(this);

    VDRest.helper.log(this);
};

Gui.SearchTimer.Controller.Window.SearchTimer.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    this.requestSearchForm();
    this.preventReload(this.view.node[0], this.view.body.find('form')[0]);
};

/**
 * remove event listeners
 */
Gui.SearchTimer.Controller.Window.SearchTimer.prototype.removeObserver = function () {};


/**
 * trigger search form
 */
Gui.SearchTimer.Controller.Window.SearchTimer.prototype.requestSearchForm = function () {

    var config = this.view.getSearchFormData(true);

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
Gui.SearchTimer.Controller.Window.SearchTimer.prototype.destructView = function () {

    var me = this;

    // apply animation
    this.view.node.toggleClass('collapse expand');
    // remove on animation end
    this.view.node.one(this.animationEndEvents, function () {

        Gui.Window.Controller.Abstract.prototype.destructView.call(me);
    });
};