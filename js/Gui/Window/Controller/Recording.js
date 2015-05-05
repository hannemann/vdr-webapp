/**
 * @class
 * @constructor
 */
Gui.Window.Controller.Recording = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.Controller.Recording.prototype = new Gui.Window.Controller.Abstract();

/**
 * @type {string}
 */
Gui.Window.Controller.Recording.prototype.cacheKey = 'id';

/**
 * initialize view and viewModel
 */
Gui.Window.Controller.Recording.prototype.init = function () {

    var recording = this.getData('recording').dataModel;

    this.eventPrefix = 'window.recording' + this.keyInCache;

    this.view = this.module.getView('Recording', {
        "id": this.keyInCache
    });

    this.module.getViewModel('Recording', {
        "id": this.keyInCache,
        "view" : this.view,
        "resource" : recording.getData()
    });

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * dispatch
 */
Gui.Window.Controller.Recording.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * add event listeners
 */
Gui.Window.Controller.Recording.prototype.addObserver = function () {

    this.view.subToFilenameButton.on('click', this.view.subToFilename.bind(this.view));

    this.view.deleteButton.on('click', this.deleteRecordingAction.bind(this));

    if (VDRest.info.getStreamer()) {
        this.view.watchButton.on('click', this.watchRecordingAction.bind(this));
    }

    $document.on('persistrecordingschange-' + this.keyInCache, this.updateRecordingAction.bind(this));

    Gui.Window.Controller.Abstract.prototype.addObserver.call(this);
};
/**
 * add event listeners
 */
Gui.Window.Controller.Recording.prototype.removeObserver = function () {

    this.view.subToFilenameButton.off('click');

    this.view.deleteButton.off('click');

    if (VDRest.info.getStreamer()) {
        this.view.watchButton.off('click');
    }

    $document.off('persistrecordingschange-' + this.keyInCache);

    Gui.Window.Controller.Abstract.prototype.removeObserver.call(this);
};

/**
 * trigger update of recording
 */
Gui.Window.Controller.Recording.prototype.updateRecordingAction = function (e) {

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
 * trigger deletion of recording
 */
Gui.Window.Controller.Recording.prototype.deleteRecordingAction = function () {

    this.vibrate();

    VDRest.app.getModule('VDRest.Recordings')
        .getResource('List.Recording')
        .deleteRecording(this.view, this.afterDeleteAction.bind(this));
};

/**
 * watch recording
 */
Gui.Window.Controller.Recording.prototype.watchRecordingAction = function () {

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
Gui.Window.Controller.Recording.prototype.afterDeleteAction = function () {

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
Gui.Window.Controller.Recording.prototype.destructView = function () {

    var me = this;
    // remove on animation end
    this.view.node.one(this.animationEndEvents, function () {

        Gui.Window.Controller.Abstract.prototype.destructView.call(me);
    });
    // apply animation
    this.view.node.toggleClass('collapse expand');
};