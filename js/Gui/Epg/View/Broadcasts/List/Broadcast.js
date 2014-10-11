/**
 * @class
 * @constructor
 */
Gui.Epg.View.Broadcasts.List.Broadcast = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype = new VDRest.Abstract.View();

/**
 * @type {string}
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.cacheKey = 'channel/id';

/**
 * initialize dom
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.init = function () {

    this.node = $('<div class="broadcast" data-position="' + this.getData('position') + '"></div>');

    this.info = $('<div class="content">').appendTo(this.node);
};

/**
 * render dom
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.render = function () {

    var me = this;

    this.node.attr('data-right', this.getRight());

    if (0 === this.getData('position')) {

        this.parentView.node.append(this.node);

    } else {

        this.parentView.node.find('div.broadcast').each(function () {

            if (me.getData('position') > parseInt($(this).attr('data-position'), 10)) {

                me.node.insertAfter(this);
            }
        });

    }

    this.isRendered = !this.isRendered;
};

/**
 * add info, classes etc.
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.decorate = function () {

    this.setWidth().addTitle().addClasses().addChannelViewInfo();
};

/**
 * set width in epg view
 * @returns {Gui.Epg.View.Broadcasts.List.Broadcast}
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.setWidth = function () {

    this.node.css({
        "width" : this.getWidth() + 'px',
        "left" : this.getLeft() + 'px'
    });

    return this;
};

/**
 * add classes
 * @returns {Gui.Epg.View.Broadcasts.List.Broadcast}
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.addClasses = function () {

    var classNames = [], rating = this.getRating();

    if (this.getTimerExists()) {
        this.handleTimerExists(true);
    }

    if (this.getTimerActive()) {
        this.handleTimerActive(true);
    }

    if (this.getIsRecording()) {
        this.handleIsRecording(true);
    }

    if (rating) {

        this.info.addClass('rating-' + rating);
    }

    if (this.getTopTip()) {

        this.info.addClass('top-tipp');
    }

    this.node.addClass(classNames.join(' '));
    return this;
};

/**
 * add Title
 * @returns {Gui.Epg.View.Broadcasts.List.Broadcast}
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.addTitle = function () {

    $('<div class="title">').text(this.getTitle()).appendTo(this.info);

    return this;
};

/**
 * add info only visible in channel view
 * @returns {Gui.Epg.View.Broadcasts.List.Broadcast}
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.addChannelViewInfo = function () {

    this.channelView = $('<div class="visible-channel-view">');

    if (this.hasShortText()) {

        $('<div class="short-text italic">')
            .text(this.getShortText())
            .appendTo(this.channelView);
    }

    $('<span class="time">')
        .text(
            this.helper().getDateTimeString(new Date(this.getStartTime() * 1000))
            + ' (' + this.helper().getDurationAsString(this.getDuration()) + ')'
        )
        .appendTo(this.channelView);

    this.channelView.appendTo(this.info);

    return this;
};

/**
 * handle timer exists
 * @param exists
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.handleTimerExists = function (exists) {

    if (exists) {

        this.node.addClass('timer-exists');
    } else {

        this.node.removeClass('timer-exists');
    }
};

/**
 * handle timer is active
 * @param active
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.handleTimerActive = function (active) {

    if (active) {

        this.node.addClass('timer-active');
    } else {

        this.node.removeClass('timer-active');
    }
};

/**
 * handle timer is recording
 * @param recording
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.handleIsRecording = function (recording) {

    if (recording) {

        this.node.addClass('timer-recording');
    } else {

        this.node.removeClass('timer-recording');
    }
};
