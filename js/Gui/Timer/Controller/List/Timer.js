/**
 * @class
 * @constructor
 */
Gui.Timer.Controller.List.Timer = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Timer.Controller.List.Timer.prototype = new VDRest.Abstract.Controller();

Gui.Timer.Controller.List.Timer.prototype.cacheKey = 'id';

/**
 * retrieve view
 */
Gui.Timer.Controller.List.Timer.prototype.init = function () {

    this.view = this.module.getView('List.Timer', {
        "id" : this.data.id
    });

    this.view.setParentView(
        this.data.parent.view
    );

    this.dataModel = VDRest.app.getModule('VDRest.Timer').getModel('List.Timer', {
        "id" : this.data.id
    });

    this.module.getViewModel('List.Timer', {
        "id" : this.data.id,
        "view" : this.view,
        "resource" : this.dataModel.data
    });
};

/**
 * dispatch view, init event handling
 */
Gui.Timer.Controller.List.Timer.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * add event listeners
 */
Gui.Timer.Controller.List.Timer.prototype.addObserver = function () {

    this.view.node.on('click', $.proxy(this.editAction, this));
};

/**
 * remove event listeners
 */
Gui.Timer.Controller.List.Timer.prototype.removeObserver = function () {

    this.view.node.off('click');
};

/**
 * request edit window
 */
Gui.Timer.Controller.List.Timer.prototype.editAction = function () {

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