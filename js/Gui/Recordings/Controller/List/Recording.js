/**
 * @class
 * @constructor
 * @property {{}} data
 * @property {Gui.Recordings.Controller.List.Directory} data.parent
 * @property {string} data.file_name
 * @property {string} data.name
 * @property {number} data.start_time
 * @property {VDRest.Recordings.Model.List.Recording} dataModel
 * @property {Gui.Recordings.View.List.Recording} view
 * @property {boolean|undefined} isMuted
 * @property {boolean|undefined} preventClick
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

    this.view.node
        .on(VDRest.helper.pointerEnd, this.handleUp.bind(this))
        .on(VDRest.helper.pointerMove, this.handleMove.bind(this))
        .on(VDRest.helper.pointerStart, this.handleDown.bind(this))
    ;
    this.view.menuButton.on(VDRest.helper.pointerStart, this.requestMenuAction.bind(this));
};

/**
 * dispatch view, init event handling
 */
Gui.Recordings.Controller.List.Recording.prototype.removeObserver = function () {

    this.view.node
        .off(VDRest.helper.pointerEnd)
        .off(VDRest.helper.pointerMove)
        .off(VDRest.helper.pointerStart);
    this.view.menuButton.off(VDRest.helper.pointerStart);
};

/**
 * handle mouseup
 * @param {jQuery.Event} e
 * @param {boolean} e.cancelable
 */
Gui.Recordings.Controller.List.Recording.prototype.handleUp = function (e) {

    if (e.cancelable) {
        e.preventDefault();
    }

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

            activeAnimate.endAnimation();
            $document.one(VDRest.helper.isTouchDevice ? 'touchend' : 'mouseup', function () {
                if (!VDRest.helper.canCancelEvent) {
                    this.requestMenuAction(e)
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

    var module = this.winModule || this.module;

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
            "module" : module,
            "data" : {
                "node" : this.view,
                "id": this.keyInCache.toCacheKey(),
                "recording" : this
            }
        }
    });
};

/**
 * request edit window
 */
Gui.Recordings.Controller.List.Recording.prototype.requestMenuAction = function (e) {

    if (e) {
        e.stopPropagation();
    }

    this.preventClick = true;

    $.event.trigger({
        "type": "window.request",
        "payload": {
            "type": "ItemMenu",
            "data": {
                "config": {
                    "header": this.data.name,
                    "buttons": {
                        "delete": {
                            "label": VDRest.app.translate('Delete'),
                            "fn": this.deleteAction.bind(this)
                        },
                        "watch": {
                            "label": VDRest.app.translate('Watch'),
                            "fn": this.startStream.bind(this)
                        }
                    }
                }
            }
        }
    })
};

/**
 * update list view
 */
Gui.Recordings.Controller.List.Recording.prototype.deleteAction = function () {

    this.dataModel.delete(this.afterDeleteAction.bind(this));
};

/**
 * handle after delete
 */
Gui.Recordings.Controller.List.Recording.prototype.afterDeleteAction = function () {

    var current = VDRest.app.getCurrent();

    if ('Gui.Recordings' === current) {
        this.module.getController('List').refresh();
    }

    if ('Gui.SearchTimer' === current) {
        VDRest.app.getModule(current)
            .getController('Recordings')
            .removeRecording(this.data.file_name);
    }
};

/**
 * update list view
 */
Gui.Recordings.Controller.List.Recording.prototype.updateAction = function () {

    this.module.getController('List').refresh()
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
