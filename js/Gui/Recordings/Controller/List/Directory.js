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

//    this.addObserver();
};