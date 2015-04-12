/**
 * @class
 * @constructor
 *
 * @property {function(): Array.<String>} hasImages
 * @property {function(): Boolean} getTimerExists
 * @property {function(): Boolean} getTimerActive
 * @property {function(): String} getTitle
 * @property {function(): (additionalMediaMovie|additionalMediaEpisode)} getAdditionalMedia
 * @property {function(): Array.<String>} getImages
 * @property {function(): Boolean} hasShortText
 * @property {function(): String} getShortText
 * @property {function(): String} getDescription
 * @property {function(): (String|Boolean)} getEpgImage
 * @property {function(Number): (String|Boolean)} getEpisodeImage
 * @property {function(Number): (String|Boolean)} getFanart
 * @property {function(): number} getDuration
 * @property {function(): boolean} getIsRecording
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
 * @type {Boolean}
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.imageInEpgView = VDRest.config.getItem('showImageInEpgView');

/**
 * initialize dom
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.init = function () {

    this.node = $('<div class="broadcast" data-pos="' + this.data.position + '"></div>');

    this.info = $('<div class="content">').appendTo(this.node);
};

/**
 * render dom
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.render = function () {

    var previous = this.data.listController.broadcasts[this.data.position - 1];

    this.node.attr('data-pos', this.data.position);

    if (0 === this.data.position) {
        this.parentView.node.prepend(this.node);
    } else if (previous && previous.view.isRendered) {
        this.node.insertAfter(previous.view.node)
    } else {
        this.parentView.node.append(this.node);
    }

    this.title.find('span').css({
        "background-size": this.getWidth() + 'px ' + this.node.height() + 'px'
    });
    this.addImage();

    this.isRendered = !this.isRendered;
};

Gui.Epg.View.Broadcasts.List.Broadcast.prototype.update = function () {

    if (this.needsUpdate) {
        this.setWidth();
        this.node.attr('data-pos', this.data.position);
    }
    this.needsUpdate = false;
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

    var classNames = ['clearer'], rating = this.getRating();

    if (this.getTimerExists()) {
        this.handleTimerExists(true);
    }

    if (this.getTimerActive()) {
        this.handleTimerActive(true);
    }

    if (this.getIsRecording()) {
        this.handleIsRecording(true);
    }

    if (this.hasImages()) {
        classNames.push('has-image');
    }

    if (rating) {

        this.info.addClass('rating-' + rating);
    }

    if (this.getTip()) {

        this.info.addClass('tip');
    }

    if (this.getTopTip()) {

        this.info.addClass('top-tip');
    }

    if (this.getTipOfTheDay()) {

        this.info.addClass('tip-of-the-day');
    }

    this.node.addClass(classNames.join(' '));
    return this;
};

/**
 * add Title
 * @returns {Gui.Epg.View.Broadcasts.List.Broadcast}
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.addTitle = function () {

    this.title = $('<div class="title">').html(
        '<span>' + this.getTitle() + '</span>'
    ).appendTo(this.info);

    return this;
};

/**
 * add Title
 * @type {additionalMediaMovie} media
 * @returns {Gui.Epg.View.Broadcasts.List.Broadcast}
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.addImage = function () {

    var img,
        src = this.getEpisodeImage(100) || this.getEpgImage() || this.getFanart(100);

    if (src) {

        if (this.imageInEpgView && this.getWidth() >= 45 * 60 * VDRest.config.getItem('pixelPerSecond')) {
            img = new Image();
            if (location.host != VDRest.config.getItem('host')) {
                img.crossOrigin = '';
            }
            img.height = this.node.height();
            try {
                $('<div class="visible-epg-view broadcast-image">').append(img).prependTo(this.node);
                VDRest.image.applyTransparencyGradient(img, src, 40, 10);
            } catch (e) {
                VDRest.helper.log('Error resizing image', this, src);
            }
        }

        img = $('<img>').attr('src', src);

        $('<div class="visible-channel-view broadcast-image">').append(img).prependTo(this.node);
    }


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

    $('<div>')
        .addClass('description')
        .html(this.getDescription())
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
