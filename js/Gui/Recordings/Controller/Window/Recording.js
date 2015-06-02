/**
 * @class
 * @constructor
 */
Gui.Recordings.Controller.Window.Recording = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Recordings.Controller.Window.Recording.prototype = new Gui.Window.Controller.ScrollAnimateHeader();

/**
 * @type {string}
 */
Gui.Recordings.Controller.Window.Recording.prototype.cacheKey = 'id';

/**
 * initialize view and viewModel
 */
Gui.Recordings.Controller.Window.Recording.prototype.init = function () {

    this.eventPrefix = 'window.recording' + this.keyInCache;

    this.view = this.module.getView('Window.Recording', {
        "id": this.keyInCache
    });

    this.module.getViewModel('Window.Recording', {
        "id": this.keyInCache,
        "view" : this.view,
        "resource": this.getData('recording').dataModel
    });

    Gui.Window.Controller.ScrollAnimateHeader.prototype.init.call(this);
};

/**
 * dispatch
 */
Gui.Recordings.Controller.Window.Recording.prototype.dispatchView = function () {

    $.event.trigger({
        "type" : "hideContextMenu"
    });

    Gui.Window.Controller.ScrollAnimateHeader.prototype.dispatchView.call(this);

    this.addObserver();

    this.header = VDRest.app.getModule('Gui.Menubar').getView('Default').getHeader();
    this.oldHeader = this.header.text();
    this.header.text(this.data.recording.dataModel.data.name.split('~').pop());
};

/**
 * add event listeners
 */
Gui.Recordings.Controller.Window.Recording.prototype.addObserver = function () {

    this.view.subToFilenameButton.on('click', this.view.subToFilename.bind(this.view));

    this.view.deleteButton.on('click', this.deleteRecordingAction.bind(this));

    if (VDRest.info.getStreamer()) {
        this.view.watchButton.on('click', this.watchRecordingAction.bind(this));
    }

    $document.on('persistrecordingschange-' + this.keyInCache, this.updateRecordingAction.bind(this));

    Gui.Window.Controller.ScrollAnimateHeader.prototype.addObserver.call(this);
};
/**
 * add event listeners
 */
Gui.Recordings.Controller.Window.Recording.prototype.removeObserver = function () {

    this.view.subToFilenameButton.off('click');

    this.view.deleteButton.off('click');

    if (VDRest.info.getStreamer()) {
        this.view.watchButton.off('click');
    }

    $document.off('persistrecordingschange-' + this.keyInCache);

    Gui.Window.Controller.ScrollAnimateHeader.prototype.removeObserver.call(this);
};

/**
 * trigger update of recording
 */
Gui.Recordings.Controller.Window.Recording.prototype.updateRecordingAction = function (e) {

    this.vibrate();

    var fields = e.payload,
        target, recording = this.getData('recording').dataModel;

    if (fields.dirname.getValue() !== '') {

        target = fields.dirname.getValue() + '~' + fields.filename.getValue();
        recording.setData('newPath', fields.dirname.getValue());

    } else {

        target = fields.filename.getValue();
    }

    recording.setData('newFileName', fields.filename.getValue());

    VDRest.app.getModule('VDRest.Recordings')
        .getResource('List.Recording')
        .moveRecording({
            "source" : this.view.getFileName(),
            "target" : target,
            "eventSuffix": this.keyInCache
        });
};

/**
 * trigger update of window
 */
Gui.Recordings.Controller.Window.Recording.prototype.updateAction = function () {

    var newKey = this.data.recording.dataModel.keyInCache.toCacheKey();

    // update tabs
    $.event.trigger({
        "type": "gui.tabs.update-" + this.keyInCache,
        "payload": {
            "method": "updateCacheKey",
            "args": [newKey]
        }
    });

    // update form
    $.event.trigger({
        "type": "gui.form.update-" + this.keyInCache,
        "payload": {
            "method": "updateCacheKey",
            "args": [newKey]
        }
    });

    this.removeObserver();
    this.module.cache.updateKeys(this, newKey);
    this.addObserver();
    this.header.text(this.data.recording.dataModel.data.name.split('~').pop());
    this.view.update();

    $.event.trigger({
        "type": "opaqueMenubar",
        "payload": !!this.view.fanart
    });
};

/**
 * trigger deletion of recording
 */
Gui.Recordings.Controller.Window.Recording.prototype.deleteRecordingAction = function () {

    this.vibrate();

    VDRest.app.getModule('VDRest.Recordings')
        .getResource('List.Recording')
        .deleteRecording(this.view, this.afterDeleteAction.bind(this));
};

/**
 * watch recording
 */
Gui.Recordings.Controller.Window.Recording.prototype.watchRecordingAction = function () {

    this.vibrate();

    VDRest.app.getModule('Gui.Recordings')
        .getController(
        'List.Recording',
        {"file_name": this.data.recording.keyInCache}
    ).startStream();
};

/**
 * handle delete
 */
Gui.Recordings.Controller.Window.Recording.prototype.afterDeleteAction = function () {

    var model = VDRest.app.getModule('VDRest.Recordings').getModel(
            'List.Recording',
            this.data.recording.keyInCache
        ),
        view = VDRest.app.getModule('Gui.Recordings')
            .getView('List.Recording', this.data.recording.keyInCache),
        recording = this.getData('recording'),
        parent = recording.getData('parent'),
        oldFilesList = parent.getData('files'), newFilesList = [], i = 0, l = oldFilesList.length;

    for(i;i<l;i++) {
        if (oldFilesList[i] !== recording) {
            newFilesList.push(oldFilesList[i]);
        }
    }

    parent.setData('files', newFilesList);

    VDRest.app.getModule('VDRest.Recordings').cache.invalidateAllTypes(model);

    VDRest.app.getModule('Gui.Recordings').cache.invalidateAllTypes(view);

    view.destruct();

    history.back();
};

/**
 * Destroy
 */
Gui.Recordings.Controller.Window.Recording.prototype.destructView = function () {

    var me = this;
    // remove on animation end
    this.view.node.one(this.animationEndEvents, function () {

        Gui.Window.Controller.ScrollAnimateHeader.prototype.destructView.call(me);

        $.event.trigger({
            "type" : "showContextMenu"
        });
    });
    // apply animation
    this.view.node.toggleClass('collapse expand');

    me.header.text(me.oldHeader);
};