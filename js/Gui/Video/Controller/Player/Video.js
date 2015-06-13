/**
 * @constructor
 */
Gui.Video.Controller.Player.Video = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Video.Controller.Player.Video.prototype = new VDRest.Abstract.Controller();

/**
 * @type {boolean}
 */
Gui.Video.Controller.Player.Video.prototype.bypassCache = true;

/**
 * @type {boolean}
 */
Gui.Video.Controller.Player.Video.prototype.noTimeUpdateWorkaround = true;

/**
 * initialize
 */
Gui.Video.Controller.Player.Video.prototype.init = function () {

    this.view = this.module.getView('Player.Video', {
        "player" : this.data.parent
    });
};

/**
 * dispatch video tag
 */
Gui.Video.Controller.Player.Video.prototype.dispatchView = function () {

    this.view.setParentView(this.data.parent.view);

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    this.setDefaultPoster();
};

/**
 * add playing event listener
 * @param {function} callback
 * @param {boolean} once
 */
Gui.Video.Controller.Player.Video.prototype.addPlayObserver = function(callback, once) {

    var method = once ? 'one' : 'on';

    this.view.node[method]('playing', callback);
};

/**
 * add time update event listener
 * @param {function} callback
 * @param {boolean} [once]
 */
Gui.Video.Controller.Player.Video.prototype.addTimeUpdateObserver = function(callback, once) {

    var method = once ? 'one' : 'on';

    this.view.node[method]('timeupdate', callback);
};

/**
 * add stalled event listener
 * @param {function} callback
 */
Gui.Video.Controller.Player.Video.prototype.addStalledObserver = function(callback) {

    this.view.node.on('stalled', callback);
};

/**
 * remove event listener
 */
Gui.Video.Controller.Player.Video.prototype.removeObserver = function() {

    this.view.node.off('playing');
    this.view.node.off('timeupdate');
    this.view.node.off('stalled');
};

/**
 * get volume
 */
Gui.Video.Controller.Player.Video.prototype.getVolume = function () {

    return this.view.node[0].volume;
};

/**
 * set volume
 */
Gui.Video.Controller.Player.Video.prototype.setVolume = function (volume) {

    this.view.node[0].volume = volume;
};

/**
 * get current playback time
 */
Gui.Video.Controller.Player.Video.prototype.getCurrentTime = function () {

    return this.view.node[0].currentTime;
};

/**
 * set playback source
 */
Gui.Video.Controller.Player.Video.prototype.setSrc = function (src) {

    this.view.node[0].src = src;
    return this;
};

/**
 * start playback
 */
Gui.Video.Controller.Player.Video.prototype.play = function (url) {

    this.setSrc(url);
    this.view.node[0].play();
    return this;
};

/**
 * pause playback
 */
Gui.Video.Controller.Player.Video.prototype.pause = function () {

    this.view.node[0].pause();
    this.setSrc(false);
    return this;
};

/**
 * toggle throbber
 */
Gui.Video.Controller.Player.Video.prototype.toggleThrobber = function () {

    this.view.throbber.toggleClass('show');
    return this;
};

/**
 * set poster with icon
 */
Gui.Video.Controller.Player.Video.prototype.setDefaultPoster = function () {

    this.view.node[0].poster = this.module.getHelper('Player').defaultPoster(this.view.node[0]);
    return this;
};

/**
 * set recording poster
 */
Gui.Video.Controller.Player.Video.prototype.setPoster = function () {

    this.view.node[0].poster = this.module.getHelper('Player').captureFrame(this.view.node[0]);
    return this;
};

/**
 * destruct view
 */
Gui.Video.Controller.Player.Video.prototype.destructView = function () {

    VDRest.Abstract.Controller.prototype.destructView.call(this);
};