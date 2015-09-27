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
    $document.on('gui-recording.updated.' + this.keyInCache, this.updateAction.bind(this));

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
    $document.off('gui-recording.updated.' + this.keyInCache);

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

    var newKey = this.data.recording.dataModel.data[this.data.recording.dataModel.cacheKey].toCacheKey();

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

    this.module.getController('List').refresh();

    $.event.trigger({
        "type": "transparentMenubar",
        "payload": {
            "set" : !!this.view.fanart,
            "omitIncrement" : true
        }
    });
};

/**
 * trigger deletion of recording
 */
Gui.Recordings.Controller.Window.Recording.prototype.deleteRecordingAction = function () {

    this.vibrate();

    this.data.recording.dataModel.delete(this.afterDeleteAction.bind(this));
};

/**
 * handle delete
 */
Gui.Recordings.Controller.Window.Recording.prototype.afterDeleteAction = function () {

    this.module.getController('List').refresh();

    history.back();
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