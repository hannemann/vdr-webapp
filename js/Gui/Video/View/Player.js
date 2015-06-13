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
 * initialize osd
 * @returns {Gui.Video.View.Player}
 */
Gui.Video.View.Player.prototype.initOsd = function () {

    if ("undefined" !== typeof this.osd) {
        this.osd.remove();
    }

    this.osd = $('<div class="video-osd">').appendTo(this.module.getView('Player.Controls').node);
    this.addTitle()
        .addTimeLine()
        .addProgress()
        .updateProgress()
        .scrollTitle();

    return this;
};

/**
 * show quality overlay
 * @param {Boolean} [force]
 */
Gui.Video.View.Player.prototype.toggleQuality = function (force) {

    this.module.getController('Player.Controls').stopHide();
    this.qualitySelect.toggleClass('show', force);
};

/**
 * toggle timeline active state
 */
Gui.Video.View.Player.prototype.toggleTimeLineActiveState = function () {

    this.ctrlTimeline.toggleClass('active');
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
 * @param {Number} [time]
 * update timer
 */
Gui.Video.View.Player.prototype.updateProgress = function (time) {

    var now, broadcast;

    if (isNaN(time)) {
        if (this.data.isVideo) {
            time = this.getData('startTime') + this.module.getController('Player.Video').getCurrentTime();
        } else {
            now = parseInt(new Date().getTime() / 1000, 10);
            broadcast = this.getData('current_broadcast');
            if (broadcast) {
                time = now - broadcast.getData('start_time');
            } else {
                time = 0;
            }
        }
    }

    this.currentProgress.text(this.helper().getDurationAsString(time, true));
    this.setTimelineSliderWidth();
    return this;
};

/**
 * add quality selector
 */
Gui.Video.View.Player.prototype.addQualitySelector = function () {

    var i, l = this.bitrates.length, item;

    this.qualitySelect = $('<div class="quality-select">');
    this.qualitySelect.attr('data-animate', 'opacity');
    this.sizeSelect = $('<div class="select size-select">').appendTo(this.qualitySelect);
    this.bitrateSelect = $('<div class="select bitrate-select">').appendTo(this.qualitySelect);

    this.sizeList = $('<div class="item-list sizes">').appendTo(this.sizeSelect);
    for (i in this.sizes) {
        if (this.sizes.hasOwnProperty(i)) {
            item = '<div class="item size' +
            (i == VDRest.config.getItem('videoQualitySize') ? ' selected' : '')
            + '">';
            $(item).text(i).appendTo(this.sizeList);
        }
    }

    this.bitrateList = $('<div class="item-list bitrates">').appendTo(this.bitrateSelect);
    for (i=0; i<l; i++) {
        item = '<div class="item bitrate' +
        (this.bitrates[i] == VDRest.config.getItem('videoQualityBitrate') ? ' selected' : '')
        + '">';
        $(item).text(this.bitrates[i]).appendTo(this.bitrateList);
    }

    this.qualitySelect.appendTo(this.module.getController('Player.Controls').view.node);

    return this;
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