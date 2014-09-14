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
Gui.Window.Controller.Recording.prototype.cacheKey = 'number';

/**
 * initialize view and viewModel
 */
Gui.Window.Controller.Recording.prototype.init = function () {

    this.eventPrefix = 'window.recording' + this.data.number;

    this.view = this.module.getView('Recording', this.data);

    this.module.getViewModel('Recording', {
        "number" : this.data.number,
        "view" : this.view,
        "resource" : this.data.resource
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

    this.view.subToFilenameButton.on('click', $.proxy(this.view.subToFilename, this.view));

    this.view.deleteButton.on('click', $.proxy(this.deleteRecordingAction, this));

    this.view.watchButton.on('click', $.proxy(this.watchRecordingAction, this));

    $(document).on('persistrecordingschange-' + this.keyInCache, $.proxy(this.updateRecordingAction, this));

    Gui.Window.Controller.Abstract.prototype.addObserver.call(this);
};
/**
 * add event listeners
 */
Gui.Window.Controller.Recording.prototype.removeObserver = function () {

    this.view.subToFilenameButton.off('click');

    this.view.deleteButton.off('click');

    this.view.watchButton.off('click');

    $(document).off('persistrecordingschange-' + this.keyInCache);
};

/**
 * trigger update of recording
 */
Gui.Window.Controller.Recording.prototype.updateRecordingAction = function (e) {

    var fields = e.payload,
        target;

    if (fields.dirname.getValue() !== '') {

        target = fields.dirname.getValue() + '~' + fields.filename.getValue();
        this.data.resource.newPath = fields.dirname.getValue();

    } else {

        target = fields.filename.getValue();
    }

    this.data.resource.newFileName = fields.filename.getValue();

    VDRest.app.getModule('VDRest.Recordings')
        .getResource('List.Recording')
        .moveRecording({
            "source" : this.view.getFileName(),
            "target" : target,
            "number" : this.data.number
        });
};

/**
 * trigger deletion of recording
 */
Gui.Window.Controller.Recording.prototype.deleteRecordingAction = function () {

    VDRest.app.getModule('VDRest.Recordings')
        .getResource('List.Recording')
        .deleteRecording(this.view, $.proxy(this.afterDeleteAction, this));
};

/**
 * watch recording
 */
Gui.Window.Controller.Recording.prototype.watchRecordingAction = function () {

    var streamdevParams = [];

    streamdevParams.push(VDRest.config.getItem('streamdevParams'));
    if (VDRest.config.getItem('useHtmlPlayer')) {
        streamdevParams.push('TYPE=webm');
    }

    this.streamUrl = 'http://'
    + VDRest.config.getItem('host')
    + ':'
    + VDRest.config.getItem('streamdevPort')
    + '/' + streamdevParams.join(';') + '/'
    + parseInt(parseInt(this.getData('number'), 10) + 1, 10).toString()
    + '.rec.ts';

    if (VDRest.config.getItem('useHtmlPlayer')) {

        $.event.trigger({
            "type" : "window.request",
            "payload" : {
                "type" : "VideoPlayer",
                "data" : {
                    "url" : this.streamUrl
                }
            }
        });
    } else {
        window.location.href = this.streamUrl;
    }

};

/**
 * handle delete
 */
Gui.Window.Controller.Recording.prototype.afterDeleteAction = function () {

    var model = VDRest.app.getModule('VDRest.Recordings').getModel(
            'List.Recording',
            this.keyInCache
        ),
        view = VDRest.app.getModule('Gui.Recordings').getView('List.Recording', this.keyInCache);

    VDRest.app.getModule('VDRest.Recordings').cache.invalidateAllTypes(model);

    VDRest.app.getModule('Gui.Recordings').cache.invalidateAllTypes(view);

    view.destruct();

    this.destructView();
};

/**
 * Destroy
 */
Gui.Window.Controller.Recording.prototype.destructView = function () {

    var me = this;


    if (VDRest.config.getItem('useHtmlPlayer')) {

    }


    // apply animation
    this.view.node.toggleClass('collapse expand');
    // remove on animation end
    this.view.node.one(this.animationEndEvents, function () {

        Gui.Window.Controller.Abstract.prototype.destructView.call(me);
    });
};