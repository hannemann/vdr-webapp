/**
 * @class
 * @constructor
 */
Gui.Recordings.Controller.List.Directory = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Recordings.Controller.List.Directory.prototype = new VDRest.Abstract.Controller();

/**
 * @type {string}
 */
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
Gui.Recordings.Controller.List.Directory.prototype.dispatchView = function (position, omitObserver) {

    this.view.position = position;

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    if ("root" !== this.keyInCache && !omitObserver) {

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
 * remove events of directory node
 */
Gui.Recordings.Controller.List.Directory.prototype.removeObserver = function () {

    this.view.node.off('click');
};

/**
 * request window
 */
Gui.Recordings.Controller.List.Directory.prototype.requestWindow = function (e) {

    this.vibrate();
    e.preventDefault();
    e.stopPropagation();
    this.removeObserver();
    $(document).one(this.animationEndEvents, $.proxy(function () {
        this.addObserver();
    }, this));

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "hashSuffix" : '~' + this.data.path,
            "type" : "Directory",
            "data" : {
                "listItem" : this.view,
                "dispatch" : $.proxy(this.view.renderItems, this.view),
                "path" : this.data.path,
                "id" : this.data.path.toCacheKey()
            }
        }
    });
};

Gui.Recordings.Controller.List.Directory.prototype.getPosition = function () {

    var dirs = this.view.getParent().view.getDirectories(), i = 0, l = dirs.length;

    for (i; i<l; i++) {

        if (dirs[i] === this) {

            return i;
        }
    }
    return undefined;
};
