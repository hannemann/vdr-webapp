/**
 * @class
 * @constructor
 */
Gui.Recordings.Controller.List.Directory = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Recordings.Controller.List.Directory.prototype = new VDRest.Abstract.Controller();

Gui.Recordings.Controller.List.Directory.prototype.cacheKey = 'path';

/**
 * retrieve view
 */
Gui.Recordings.Controller.List.Directory.prototype.init = function () {

    this.data.directories = [];
    this.data.files = [];

    this.view = this.module.getView('List.Directory', this.data);

    this.view.setParentView(
        this.data.parent.view
    );

    this.module.getViewModel('List.Directory', {
        "path" : this.data.path,
        "view" : this.view,
        "resource" : this.data
    });
};

/**
 * dispatch view, init event handling
 */
Gui.Recordings.Controller.List.Directory.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);


    if ("root" !== this.keyInCache) {

        this.addObserver();
    }
};

/**
 * add events to directory node
 */
Gui.Recordings.Controller.List.Directory.prototype.addObserver = function () {

    this.view.node.on('click', $.proxy(this.requestWindow, this));
};

/**
 * request window
 */
Gui.Recordings.Controller.List.Directory.prototype.requestWindow = function (e) {

    e.preventDefault();

    e.stopPropagation();

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "hashSuffix" : '~' + this.data.path,
            "type" : "Directory",
            "data" : {
                "node" : this.view,
                "dispatch" : $.proxy(this.view.renderItems, this.view),
                "path" : this.data.path
            }
        }
    });
};