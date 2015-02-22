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
 * info about streamdev server
 * @type {Object}
 */
Gui.Recordings.Controller.List.Recording.prototype.streamdevInfo = null;

/**
 * retrieve view
 */
Gui.Recordings.Controller.List.Recording.prototype.init = function () {

    if (!this.streamdevInfo) {
        Gui.Recordings.Controller.List.Recording.prototype.streamdevInfo = VDRest.app.getModule('VDRest.Info')
            .getModel('Info')
            .getPlugin('streamdev-server');
    }

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

    this.view.position = position;

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * dispatch view, init event handling
 */
Gui.Recordings.Controller.List.Recording.prototype.addObserver = function () {

    this.view.node.on('click', $.proxy(this.requestWindowAction, this));

    if (VDRest.helper.isTouchDevice) {
        this.view.node
            .on('touchend', this.handleUp.bind(this))
            .on('touchmove', this.handleMove.bind(this))
            .on('touchstart', this.handleDown.bind(this))
        ;
    } else {
        this.view.node
            .on('mouseup', this.handleUp.bind(this))
            .on('mousedown', this.handleDown.bind(this))
        ;
    }
};

/**
 * dispatch view, init event handling
 */
Gui.Recordings.Controller.List.Recording.prototype.removeObserver = function () {

    this.view.node.off('click touchend touchstart touchmove mouseup mousedown ');
};

/**
 * handle mouseup
 * @param {jQuery.Event} e
 */
Gui.Recordings.Controller.List.Recording.prototype.handleUp = function (e) {

    e.preventDefault();

    if (!this.isMuted) {

        if ("undefined" === typeof this.preventClick) {

            this.vibrate();

            if ("undefined" !== typeof this.clickTimeout) {
                window.clearTimeout(this.clickTimeout);
            }
            this.requestWindowAction(e)
        }
    }
    document.onselectstart = function () {
        return true
    };
};

/**
 * prevent click on move
 */
Gui.Recordings.Controller.List.Recording.prototype.handleMove = function () {

    this.preventClick = true;

    if ("undefined" !== typeof this.clickTimeout) {
        window.clearTimeout(this.clickTimeout);
    }
};

/**
 * handle mousedown
 */
Gui.Recordings.Controller.List.Recording.prototype.handleDown = function () {

    document.onselectstart = function () {
        return false
    };

    this.preventClick = undefined;
    if (VDRest.info.getStreamer()) {
        this.clickTimeout = window.setTimeout($.proxy(function () {

            this.vibrate(100);

            this.preventClick = true;

            this.startStream();

        }, this), 500);
    }
};

/**
 * start streaming
 */
Gui.Recordings.Controller.List.Recording.prototype.startStream = function () {

    var windowModule = VDRest.app.getModule('Gui.Window'),
        recording = this.dataModel;

    if (VDRest.info.canUseHtmlPlayer() && VDRest.info.canRemuxRecordings()) {

        if (windowModule.hasVideoPlayer()) {
            windowModule.getVideoPlayer().changeSrc(recording);
        } else {
            $.event.trigger({
                "type": "window.request",
                "payload": {
                    "type": "VideoPlayer",
                    "data": {
                        "sourceModel": recording
                    }
                }
            });
        }
    } else {
        window.location.href = recording.getStreamUrl();
    }
};

/**
 * request recording window
 */
Gui.Recordings.Controller.List.Recording.prototype.requestWindowAction = function (e) {

    this.vibrate();
    e.preventDefault();
    e.stopPropagation();
    $(document).one(this.animationEndEvents, $.proxy(function () {
        this.addObserver();
    }, this));
    this.removeObserver();

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "hashSuffix" : '~' + this.data.number,
            "type" : "Recording",
            "data" : {
                "node" : this.view,
                "number" : this.data.number,
                "recording" : this
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
        parentView,
        winModule = VDRest.app.getModule('Gui.Window'),
        dirToRender;

    this.data.name = this.view.getName().split('~').pop();

    this.addToParentDir();

    this.removeObserver();
    this.view.node.remove();

    dirToRender = this.getDirToRender(oldParent);

    if (!dirToRender.view.isRendered) {

        dirToRender.data.parent.data.directories.sort(this.helper().sortAlpha);
        dirToRender.view.setParentView(
            "root" === dirToRender.data.parent.keyInCache
            ? dirToRender.data.parent.view
            : {"node" : dirToRender.data.parent.view.parentView.body}
        );
        dirToRender.dispatchView(dirToRender.getPosition());
    }

    if ('root' === path) {

        parentView = this.module.getView('List.Directory', path);

    } else if (winModule.cache.store.View.Directory && winModule.cache.store.View.Directory[path]) {

        parentView = {"node" : winModule.cache.store.View.Directory[path].body};
    }

    if (parentView) {

        this.view.setParentView(parentView);
        this.dispatchView(this.getPosition());
    }

    this.module.getController('List').removeIfEmpty(oldParent.view.getPath());
};

/**
 * determine which directory needs to be rendered
 */
Gui.Recordings.Controller.List.Recording.prototype.getDirToRender = function (oldParent) {

    var oldPath = oldParent.keyInCache.split('~').slice(1),
        newPath = this.data.parent.keyInCache.split('~').slice(1),
        cacheKey = ['root'],
        i = 0,
        l = newPath.length;

    for (i; i<l; i++) {

        if (oldPath[i] === newPath[i]) {

            cacheKey.push(oldPath[i]);
        } else {
            break;
        }
    }

    if (newPath[i]) {
        cacheKey.push(newPath[i]);
    }
    return this.module.getController('List.Directory', cacheKey.join('~'));
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
            "number" : this.keyInCache,
            "name" : this.view.getName()
        });
        add = false;
    }

    dir = this.module.getController('List.Directory', path);

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
};

/**
 * retrieve position in sorted files array
 * @returns {int|bool}
 */
Gui.Recordings.Controller.List.Recording.prototype.getPosition = function () {

    var files = this.data.parent.data.files, i= 0, l = files.length - 1;

    this.data.parent.data.files.sort(this.helper().sortAlpha);

    for (i; i<l; i++) {

        if (files[i] === this) {

            return i;
        }
    }
    return undefined;
};
