/**
 * @class
 * @constructor
 */
Gui.Video.View.Player = function () {
};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Video.View.Player.prototype = new Gui.Window.View.Abstract();

/**
 * @type {boolean}
 */
Gui.Video.View.Player.prototype.bypassCache = true;

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Video.View.Player.prototype.isModal = true;

/**
 * @type {boolean}
 */
Gui.Video.View.Player.prototype.isModalOpaque = true;

/**
 * @type {boolean}
 */
Gui.Video.View.Player.prototype.modalExtraClasses = "modal-video";

/**
 * @type {string}
 */
Gui.Video.View.Player.prototype.cacheKey = 'url';

/**
 * initialize video node
 */
Gui.Video.View.Player.prototype.init = function () {

    this.node = $('<div class="video-player-wrapper">');
    this.defaultTitle = $('title').text();

    $('body').addClass('has-video-player');
};

/**
 * decorate and render
 */
Gui.Video.View.Player.prototype.render = function () {

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.addClasses();

    this.node.toggleClass('collapsed expand');
};

/**
 * update recording end time periodically in case of recording is paused
 * @param {Boolean} action
 */
Gui.Video.View.Player.prototype.updateRecordingEndTime = function (action) {

    var me = this,
        duration = this.data.sourceModel.getData('duration'),
        helper = this.helper();

    if (action) {
        this.endTimeInterval = setInterval(function () {

            me.end.text(helper.getTimeString(
                new Date(new Date().getTime()
                    + duration * 1000
                    - me.getData('startTime') * 1000
                )
            ));
        }, 1000);
    } else {
        clearInterval(this.endTimeInterval);
    }
};

/**
 * update start and end time
 */
Gui.Video.View.Player.prototype.updateRecordingStartEndTime = function () {

    var duration = this.data.sourceModel.getData('duration'),
        helper = this.helper(), start, end, d = new Date();


    start = helper.getTimeString(d);
    end = helper.getTimeString(new Date(d.getTime() + duration * 1000 - this.data.startTime * 1000));

    this.end.text(end);
    this.start.text(start);
};

/**
 * add classes
 * @returns {Gui.Video.View.Player}
 */
Gui.Video.View.Player.prototype.addClasses = function () {

    var classNames = ['html5-player', 'fullsize', 'collapsed'];

    this.node.addClass(classNames.join(' '));

    return this;
};

/**
 * destroy window
 */
Gui.Video.View.Player.prototype.destruct = function () {

    Gui.Window.View.Abstract.prototype.destruct.call(this);
    $('body').removeClass('has-video-player');
    $('title').text(this.defaultTitle);
};