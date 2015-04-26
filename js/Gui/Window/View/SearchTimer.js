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
Gui.Window.View.SearchTimer.prototype.hasHeader = true;

Gui.Window.View.SearchTimer.prototype.init = function () {

    if (this.getData('is_new')) {

        this.hasHeader = false;
    }

    Gui.Window.View.Abstract.prototype.init.call(this);
};

/**
 * render
 */
Gui.Window.View.SearchTimer.prototype.render = function () {

    this.decorateHeader().decorateBody();

    this.node.addClass('collapsed');

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');
};

/**
 * decorate header
 */
Gui.Window.View.SearchTimer.prototype.decorateHeader = function () {

    this.addClasses()
        .addTitle();

    return this;
};

/**
 * add classes
 * @return {Gui.Window.View.SearchTimer}
 */
Gui.Window.View.SearchTimer.prototype.addClasses = function () {

    this.node.addClass('searchtimer');
    return this;
};
/**
 * add Title
 * @returns {Gui.Window.View.SearchTimer}
 */
Gui.Window.View.SearchTimer.prototype.addTitle = function () {

    this.title = $('<h2 class="window-title left">')
        .text(this.getSearch())
        .appendTo(this.header);

    return this;
};

/**
 * decorate body
 */
Gui.Window.View.SearchTimer.prototype.decorateBody = function () {

    this.body.addClass('has-tabs');

    return this;
};

Gui.Window.View.SearchTimer.prototype.getSearchForm = function () {

    var dom = $('<div>'),
        /** @type searchTimerFormConfig */
        config = this.getSearchFormData();

    $.event.trigger({
        "type": "form.request",
        "config": {
            "parentView": {
                "node": dom
            },
            "reference": "searchTimerForm",
            "cacheKey": this.cacheKey,
            "keyInCache": this.keyInCache,
            "id": this.getId(),
            "catConfig": config.categories,
            "fields": config.fields,
            "className": "searchtimer"
        }
    });

    return dom;
};

Gui.Window.View.SearchTimer.prototype.getTimerForm = function () {
    return this.getTimerFormData();
};
