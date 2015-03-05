/**
 * @class
 * @constructor
 */
Gui.Database.Controller.List.Movie = function () {
};

/**
 * @type {Gui.Database.Controller.List.Item}
 */
Gui.Database.Controller.List.Movie.prototype = new Gui.Database.Controller.List.Item();

/**
 * add observers to clone
 */
Gui.Database.Controller.List.Movie.prototype.addCloneObserver = function () {

    Gui.Database.Controller.List.Item.prototype.addCloneObserver.call(this);
    this.clone.find('.ctrl-button.play').on('click', this.handlePlay.bind(this));
};

/**
 * handle play event
 */
Gui.Database.Controller.List.Movie.prototype.handlePlay = function () {

    var number = this.data.media.data.recording_number;

    this.vibrate();

    VDRest.app.getModule('VDRest.Recordings').loadModel('List.Recording', number, function (recording) {

        this.startStream(recording);
    }.bind(this))
};

/**
 * start streaming
 */
Gui.Database.Controller.List.Movie.prototype.startStream = function (recording) {

    if (VDRest.info.canUseHtmlPlayer() && VDRest.info.canRemuxRecordings()) {

        $.event.trigger({
            "type": "window.request",
            "payload": {
                "type": "VideoPlayer",
                "data": {
                    "sourceModel": recording
                }
            }
        });
    } else {
        window.location.href = recording.getStreamUrl();
    }
};
