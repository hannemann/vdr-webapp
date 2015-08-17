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
Gui.Recordings.Controller.List.Recording.prototype.cacheKey = 'file_name';

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
        "file_name": this.data.file_name
    });

    if (!(this.data.parent instanceof Gui.Recordings.Controller.List.Directory)) {

        this.data.parent = this.module.getController('List.Directory', this.data.parent.path)
    }

    this.view.setParentView(
        this.data.parent.view
    );

    this.dataModel = VDRest.app.getModule('VDRest.Recordings').getModel('List.Recording', {
        "file_name": this.data.file_name
    });

    this.module.getViewModel('List.Recording', {
        "file_name": this.data.file_name,
        "view" : this.view,
        "resource": this.dataModel
    });
};

/**
 * dispatch view, init event handling
 */
Gui.Recordings.Controller.List.Recording.prototype.dispatchView = function (position, omitObserver) {

    this.view.position = position;

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    if (!omitObserver) {

        this.addObserver();
    }
};

/**
 * dispatch view, init event handling
 */
Gui.Recordings.Controller.List.Recording.prototype.addObserver = function () {

    $document.on("gui-recording.updated." + this.keyInCache.toCacheKey(), this.updateAction.bind(this));

    this.view.node
        .on(VDRest.helper.pointerEnd, this.handleUp.bind(this))
        .on(VDRest.helper.pointerMove, this.handleMove.bind(this))
        .on(VDRest.helper.pointerStart, this.handleDown.bind(this))
    ;
};

/**
 * dispatch view, init event handling
 */
Gui.Recordings.Controller.List.Recording.prototype.removeObserver = function () {

    $document.off("gui-recording.updated." + this.keyInCache.toCacheKey());

    this.view.node
        .off(VDRest.helper.pointerEnd)
        .off(VDRest.helper.pointerMove)
        .off(VDRest.helper.pointerStart);
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
            if (!VDRest.helper.canCancelEvent) {
                this.requestWindowAction(e);
            }
        }
    }
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
Gui.Recordings.Controller.List.Recording.prototype.handleDown = function (e) {

    activeAnimate.applyAnimation(e, this.view.node[0]);

    this.preventClick = undefined;
    if (VDRest.info.getStreamer()) {
        this.clickTimeout = window.setTimeout(function () {

            this.vibrate(100);

            this.preventClick = true;

            $document.one(VDRest.helper.isTouchDevice ? 'touchend' : 'mouseup', function () {
                if (!VDRest.helper.canCancelEvent) {
                    this.startStream()
                }
            }.bind(this));

        }.bind(this), 1000);
    }
};

/**
 * start streaming
 */
Gui.Recordings.Controller.List.Recording.prototype.startStream = function () {

    var videoModule = VDRest.app.getModule('Gui.Video'),
        recording = this.dataModel;

    if (VDRest.info.canUseHtmlPlayer() && VDRest.info.canRemuxRecordings()) {

        if (videoModule.hasVideoPlayer()) {
            videoModule.getVideoPlayer().changeSrc(recording);
        } else {
            $.event.trigger({
                "type": "window.request",
                "payload": {
                    "type": "Player",
                    "module": VDRest.app.getModule('Gui.Video'),
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
    $document.one(this.animationEndEvents, function () {
        this.addObserver();
    }.bind(this));
    this.removeObserver();

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "hashSuffix": '~' + this.keyInCache.toCacheKey(),
            "type" : "Window.Recording",
            "module" : this.module,
            "data" : {
                "node" : this.view,
                "id": this.keyInCache.toCacheKey(),
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
        dirToRender;

    this.data.name = this.view.getName().split('~').pop();

    this.addToParentDir();

    this.removeObserver();
    this.view.node.remove();

    dirToRender = this.getDirToRender(oldParent);

    if (!dirToRender.view.isRendered) {

        dirToRender.data.parent.data.directories.sort(this.module.getController('List').view.sortCallback);
        dirToRender.view.setParentView(
            "root" === dirToRender.data.parent.keyInCache
            ? dirToRender.data.parent.view
                : {"node": this.module.getController('Window.Directory', dirToRender.data.parent.keyInCache.toCacheKey()).view.body}
        );
        dirToRender.dispatchView(dirToRender.getPosition());
    }

    if ('root' === path) {

        parentView = this.module.getView('List.Directory', path);

    } else if (this.module.cache.store.View['Window.Directory'] && this.module.cache.store.View['Window.Directory'][path.toCacheKey()]) {

        parentView = {"node": this.module.cache.store.View['Window.Directory'][path.toCacheKey()].body};
    }

    this.module.getController('List').removeIfEmpty(oldParent.view.getPath());
    if (this.module.cache.store.Controller['Window.Recording'] && this.module.cache.store.Controller['Window.Recording'][this.keyInCache.toCacheKey()]) {
        this.module.cache.store.Controller['Window.Recording'][this.keyInCache.toCacheKey()].updateAction();
    }
    this.module.cache.updateKeys(this, this.dataModel.keyInCache);

    if (parentView) {

        this.view.setParentView(parentView);
        this.dispatchView(this.getPosition());
    }
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

        dir = this.module.getController(
            'List.Directory',
            this.module.getController('List').createFolderFromFile({
                "file_name": this.dataModel.data.file_name,
                "name": this.dataModel.data.name
            })
        );
        add = false;
    } else {

        dir = this.module.getController('List.Directory', path);
    }

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
 * @returns {int|undefined}
 */
Gui.Recordings.Controller.List.Recording.prototype.getPosition = function () {

    var files = this.data.parent.data.files,
        i = 0, l = files.length - 1,
        listView = this.module.getView('List'),
        sortCallback = listView.sortCallback,
        sortReverse = listView.reverse;

    this.data.parent.data.files.sort(sortCallback);

    if (sortReverse) {
        this.data.parent.data.files.reverse();
    }

    for (i; i<l; i++) {

        if (files[i] === this) {

            return i;
        }
    }
    return undefined;
};
