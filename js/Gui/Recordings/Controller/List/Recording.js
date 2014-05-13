/**
 * @class
 * @constructor
 */
Gui.Recordings.Controller.List.Recording = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Recordings.Controller.List.Recording.prototype = new VDRest.Abstract.Controller();

/**
 * @type {string}
 */
Gui.Recordings.Controller.List.Recording.prototype.cacheKey = 'number';

/**
 * retrieve view
 */
Gui.Recordings.Controller.List.Recording.prototype.init = function () {

    this.view = this.module.getView('List.Recording', {
        "number" : this.data.number
    });

    this.view.setParentView(
        this.data.parent.view
    );

    this.dataModel = VDRest.app.getModule('VDRest.Recordings').getModel('List.Recording', {
        "number" : this.data.number
    });

    this.module.getViewModel('List.Recording', {
        "number" : this.data.number,
        "view" : this.view,
        "resource" : this.dataModel.data
    });
};

/**
 * dispatch view, init event handling
 */
Gui.Recordings.Controller.List.Recording.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * dispatch view, init event handling
 */
Gui.Recordings.Controller.List.Recording.prototype.addObserver = function () {

    this.view.node.on('click', $.proxy(this.requestWindow, this));
};

/**
 * dispatch view, init event handling
 */
Gui.Recordings.Controller.List.Recording.prototype.requestWindow = function (e) {

    e.preventDefault();

    e.stopPropagation();

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "hashSuffix" : '~' + this.data.number,
            "type" : "Recording",
            "data" : {
                "node" : this.view,
                "number" : this.data.number,
                "resource" : this.dataModel.data
            }
        }
    });
};
