/**
 * @class
 * @constructor
 */
Gui.Window.Controller.Recording = function () {};

/**
 * @type {Gui.Tabs.Controller.Abstract}
 */
Gui.Window.Controller.Recording.prototype = new Gui.Window.Controller.Abstract();

/**
 * @type {string}
 */
Gui.Window.Controller.Recording.prototype.cacheKey = 'number';

/**
 * initialize view and viewmodel
 */
Gui.Window.Controller.Recording.prototype.init = function () {

    this.eventPrefix = 'window.recording' + this.data.number;

    this.view = this.module.getView('Recording', this.data);

    this.module.getViewModel('Recording', {
        "number" : this.data.number,
        "view" : this.view,
        "resource" : this.data.resource
    });

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * dispatch
 */
Gui.Window.Controller.Recording.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

//    this.addObserver();
};

/**
 * add event listeners
 */
//Gui.Window.Controller.Recording.prototype.addObserver = function () {
//
////    var me = this;
//
//    Gui.Window.Controller.Abstract.prototype.addObserver.call(this);
//};


/**
 * handle delete
 */
Gui.Window.Controller.Recording.prototype.deleteAction = function () {

    var model = VDRest.app.getModule('VDRest.Recordings').getModel(
            'List.Recording',
            this.keyInCache
        ),
        view = VDRest.app.getModule('Gui.Recordings').getView('List.Recording', this.keyInCache);

    VDRest.app.getModule('VDRest.Recordings').cache.invalidateAllTypes(model);

    VDRest.app.getModule('Gui.Recordings').cache.invalidateAllTypes(view);

    view.destruct();

    this.destructView();
};

/**
 * Destroy
 */
Gui.Window.Controller.Recording.prototype.destructView = function () {

    var me = this;
    // apply animation
    this.view.node.toggleClass('collapse expand');
    // remove on animation end
    this.view.node.one(this.animationEndEvents, function () {

        Gui.Window.Controller.Abstract.prototype.destructView.call(me);
    });
};