/**
 * @class
 * @constructor
 * @property {function(): searchTimerFormConfig} getSearchFormData
 */
Gui.Window.View.SearchTimer = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.SearchTimer.prototype = new Gui.Window.View.Abstract();

/**
 * @type {string}
 */
Gui.Window.View.SearchTimer.prototype.cacheKey = 'id';

/**
 * @type {boolean}
 */
Gui.Window.View.SearchTimer.prototype.isModal = true;

/**
 * @type {boolean}
 */
Gui.Window.View.SearchTimer.prototype.isModalTransparent = true;

/**
 * @type {boolean}
 */
Gui.Window.View.SearchTimer.prototype.hasHeader = false;

/**
 * render
 */
Gui.Window.View.SearchTimer.prototype.render = function () {

    this.addClasses();//.getSearchForm();

    this.node.addClass('collapsed');

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');
};

/**
 * add classes
 * @return {Gui.Window.View.SearchTimer}
 */
Gui.Window.View.SearchTimer.prototype.addClasses = function () {

    this.node.addClass('searchtimer window-form');
    return this;
};

/**
 * trigger search form
 */
Gui.Window.View.SearchTimer.prototype.getSearchForm = function () {

    var config = this.getSearchFormData();

    $.event.trigger({
        "type": "form.request",
        "config": {
            "parentView": {
                "node": this.body
            },
            "reference": "searchTimerForm",
            "cacheKey": this.cacheKey,
            "keyInCache": this.keyInCache,
            "id": this.getId(),
            "catConfig": config.categories,
            "fields": config.fields,
            "className": "searchtimer",
            "hasButtons": true,
            "buttonContainer": this.node
        }
    });
};
