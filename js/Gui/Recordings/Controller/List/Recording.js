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

    $(document).on("vdrest-api-actions.recording-updated." + this.keyInCache, $.proxy(this.updateAction, this));
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

    this.view.node.on('click', $.proxy(this.requestWindowAction, this));
};

/**
 * dispatch view, init event handling
 */
Gui.Recordings.Controller.List.Recording.prototype.removeObserver = function () {

    this.view.node.off('click');

    $(document).off("vdrest-api-actions.recording-updated." + this.keyInCache);
};

/**
 * request recording window
 */
Gui.Recordings.Controller.List.Recording.prototype.requestWindowAction = function (e) {

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

/**
 * update list view
 */
Gui.Recordings.Controller.List.Recording.prototype.updateAction = function () {

    var paths = ['root'].concat(this.view.getName().split('~').slice(0,-1)).join('~'),
        dir = this.module.getController('List.Directory', paths),
        i = 0, l = this.data.parent.data.files.length, newFiles = [];

    if (dir !== this.data.parent) {

        for (i; i < l; i++) {

            if (this.data.parent.data.files[i].keyInCache === this.keyInCache) {

                continue;
            }
            newFiles.push(this.data.parent.data.files[i]);
        }
        this.data.parent.data.files = newFiles;
        dir.data.files.push(this);
        this.data.parent = dir;
        this.view.node.remove();

    } else {

        this.view.update();
    }
};
