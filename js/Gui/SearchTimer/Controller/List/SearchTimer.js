/**
 * @class
 * @constructor
 */
Gui.SearchTimer.Controller.List.SearchTimer = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype = new VDRest.Abstract.Controller();

/**
 * @type {string}
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.cacheKey = 'id';

/**
 * initialize view
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.init = function () {

    this.eventNameSpace = this.module.namespace + this.module.name;

    this.view = this.module.getView('List.SearchTimer', {
        "id" : this.data.id
    });

    this.view.setParentView(
        this.data.parent.view
    );

    this.dataModel = VDRest.app.getModule('VDRest.SearchTimer').getModel('List.SearchTimer', {
        "id" : this.data.id
    });

    this.module.getViewModel('List.SearchTimer', {
        "id" : this.data.id,
        "view" : this.view,
        "resource" : this.dataModel.data
    });
};

/**
 * dispatch view, init event handling
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * add event listeners
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.addObserver = function () {

    this.view.node.on('click', $.proxy(this.windowAction, this));

    $(document).on('gui-searchtimer.updated.' + this.keyInCache + '.' + this.eventNameSpace, $.proxy(this.update, this));
};

/**
 * remove event listeners
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.removeObserver = function () {

    this.view.node.off('click');

    $(document).off('gui-searchtimer.' + this.keyInCache + '.' + this.eventNameSpace);
};

/**
 * update data, cache, view
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.update = function (e) {

    var timer = e.payload, cache = this.module.cache.store;

    this.data.id = timer.keyInCache;
    this.view.data.id = timer.keyInCache;

    delete cache.Controller['List.SearchTimer'][this.keyInCache];
    delete cache.View['List.SearchTimer'][this.keyInCache];
    delete cache.ViewModel['List.SearchTimer'][this.keyInCache];

    this.keyInCache = timer.keyInCache;
    cache.Controller['List.SearchTimer'][this.keyInCache] = this;

    this.view.keyInCache = timer.keyInCache;
    cache.View['List.SearchTimer'][this.keyInCache] = this.view;

    this.module.getViewModel('List.SearchTimer', {
        "id" : this.data.id,
        "view" : this.view,
        "resource" : this.dataModel.data
    });

    this.removeObserver();
    this.addObserver();

    this.view.update();
};

/**
 * request edit window
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.windowAction = function () {

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "type" : "Timer",
            "data" : {
                "id" : this.dataModel.data.id,
                "resource" : this.dataModel.data
            }
        }
    })
};