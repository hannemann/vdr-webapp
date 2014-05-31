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
Gui.Recordings.Controller.List.Recording.prototype.dispatchView = function (position) {

    if (position) {

        this.view.position = position;
    }

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

    var oldParent = this.data.parent,
        path = ['root'].concat(this.view.getName().split('~').slice(0,-1)).join('~'),
        parentView, winModule = VDRest.app.getModule('Gui.Window');

    this.addToParentDir();

    if (oldParent !== this.data.parent) {

        // render newly created directory
        if (this.data.parent.data.parent.view.isRendered && !this.data.parent.view.isRendered) {

            parentView = {
                "node" : this.data.parent.data.parent.view.parentView.body
            };
            if ('root' === this.data.parent.data.parent.keyInCache) {

                parentView = this.data.parent.data.parent.view.parentView;
            }

            this.data.parent.data.parent.view.getDirectories().sort(this.helper().sortAlpha);
            this.data.parent.view.setParentView(parentView);
            this.data.parent.dispatchView(this.data.parent.getPosition());
        }

        this.view.node.remove();

        if (winModule.cache.store.View.Directory) {

            parentView = winModule.cache.store.View.Directory[path];

            if ('root' === path) {

                parentView = this.module.getView('List.Directory', path);
            }

            if (parentView) {

                this.removeObserver();
                this.view.setParentView(parentView);
                this.dispatchView(this.getPosition());
            }
        }

        if (oldParent.data.files.length === 0) {

            oldParent.destructView();
        }

    } else {

        this.view.update();
    }
};

/**
 * try to determine which directory has to be rendered
 */
Gui.Recordings.Controller.List.Recording.prototype.getDirToRender = function () {

    var oldPath = oldParent.keyInCache.split('~').slice(1),
        newPath = this.data.parent.keyInCache.split('~').slice(1),
        cacheKey = ['root'];

    for (var i=0; i<oldPath.length; i++) {

        if (oldPath[i] === newPath[i]) {

            cacheKey.push(oldPath[i]);
        } else {
            break;
        }
    }

    if (newPath[i]) {
        cacheKey.push(newPath[i]);
    }
    var dirToRender = this.module.getController('List.Directory', cacheKey.join('~'));
};

/**
 * add recording to parent directory after moving
 */
Gui.Recordings.Controller.List.Recording.prototype.addToParentDir = function () {

    var add = true,
        dir,
        l = this.data.parent.data.files.length,
        i = 0,
        newFiles = [],
        path = ['root'].concat(this.view.getName().split('~').slice(0,-1)).join('~');

    if ("undefined" === typeof this.module.cache.store.Controller['List.Directory'][path]) {

        this.module.getController('List').createFolderFromFile({
            "number" : this.view.getNumber(),
            "name" : this.view.getName()
        });
        add = false;
    }

    dir = this.module.getController('List.Directory', path);

    if (dir !== this.data.parent) {

        for (i; i < l; i++) {

            if (this.data.parent.data.files[i].keyInCache === this.keyInCache) {

                continue;
            }
            newFiles.push(this.data.parent.data.files[i]);
        }
        this.data.parent.data.files = newFiles;
        if (add) {

            dir.data.files.push(this);
        }

        this.data.parent = dir;
    }
};

/**
 * retrieve position in sorted files array
 * @returns {int|bool}
 */
Gui.Recordings.Controller.List.Recording.prototype.getPosition = function () {

    var files = this.data.parent.data.files, i= 0, l = files.length;

    this.data.parent.data.files.sort(this.helper().sortAlpha);

    for (i; i<l; i++) {

        if (files[i] === this) {

            return i;
        }
    }
    return false;
};
