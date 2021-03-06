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

    this.node = $('<div class="broadcast" data-pos="' + this.data.position + '" data-key="' + this.keyInCache + '"></div>');

    this.info = $('<div class="content">').appendTo(this.node);
};

/**
 * render dom
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.render = function () {

    var previous = this.data.listController.broadcasts[this.data.position - 1];

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
        this.addTimeLine()
            .setTimeLineWidth();
    }
    this.needsUpdate = false;
};

/**
 * add info, classes etc.
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.decorate = function () {

    this.setWidth()
        .addTitle()
        .addMenuButton()
        .addClasses()
        .addChannelViewInfo()
        .addTimeInfo()
        .addTimeLine()
        .setTimeLineWidth();
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
    this.isTip = this.getTip() || this.getTopTip() || this.getTipOfTheDay();

    if (this.getTimerExists()) {
        this.handleTimerExists(true);
    }

    if (this.getTimerActive()) {
        this.handleTimerActive(true);
    }

    if (this.getIsRecording()) {
        this.handleIsRecording(true);
    }

    if (rating && rating > 0) {

        this.info.addClass('rating-' + rating);
    }

    if (this.isTip) {

        this.info.addClass('is-tip');
    }

    if (this.getTip()) {

        this.info.addClass('tip');
        this.tip = 'tip';
    }

    if (this.getTopTip()) {

        this.info.addClass('top-tip');
        this.tip = 'top-tip';
    }

    if (this.getTipOfTheDay()) {

        this.info.addClass('tip-of-the-day');
        this.tip = 'tip-of-the-day';
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

    var img, src, width;

    width = window.matchMedia('(orientation: landscape)').matches
            ? parseInt(window.innerWidth / 100 * 19.5 - 10, 10)
            : parseInt(window.innerWidth / 100 * 33 - 10, 10);

    src = this.getEpisodeImage(width) || this.getFanart(width) || this.getEpgImage();

    if (src && "undefined" === typeof this.channelViewImage) {

        if (this.imageInEpgView && this.getWidth() >= 45 * 60 * VDRest.config.getItem('pixelPerSecond')) {
            img = new Image();
            img.crossOrigin = '';
            img.height = this.node.height();
            try {
                $('<div class="visible-epg-view broadcast-image">').append(img).prependTo(this.node);
                VDRest.image.applyTransparencyGradient(img, src, 40, 10, this.keyInCache);
                this.node.addClass('has-epg-view-image');
            } catch (e) {
                VDRest.helper.log('Error resizing image', this, src);
            }
        }

        img = $('<img>').attr('src', src);

        this.channelViewImage = $('<div class="visible-channel-view broadcast-image">')
            .append(img).insertAfter(this.title);

        this.node.addClass('has-image');
    }


    return this;
};

/**
 * add info only visible in channel view
 * @returns {Gui.Epg.View.Broadcasts.List.Broadcast}
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.addChannelViewInfo = function () {

    var shortText = '(' + this.helper().getDurationAsString(this.getDuration()) + ')';

    this.channelView = $('<div class="visible-channel-view channel-view-info">');

    if (this.hasShortText()) {
        shortText = this.getShortText() + ' ' + shortText;
    }

    $('<div class="short-text italic">')
        .text(shortText)
        .appendTo(this.channelView);

    $('<div>')
        .addClass('description')
        .html(this.getDescription())
        .appendTo(this.channelView);

    this.channelView.appendTo(this.info);

    return this;
};

/**
 * add ratings and time-info to channel view
 * @return {Gui.Epg.View.Broadcasts.List.Broadcast}
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.addTimeInfo = function () {

    var startDate = new Date(this.getStartTime() * 1000),
        rating = this.getRating(),
        tip = $('<span class="tip">'),
        ratingSpan = $('<span class="rating">');

    this.timeInfo = $('<div class="visible-channel-view time-info">');

    tip.addClass(this.tip).appendTo(this.timeInfo);
    this.timeInfo.append(ratingSpan);

    if (this.isTip) {
        tip.text('Y');
    }

    if (rating && rating > 0) {
        ratingSpan.html(
            '<span>' + new Array(rating+1).join('*') + '</span><span>' + new Array(5-rating+1).join('*') + '</span>'
        );
    }

    $('<span class="time">')
        .html('<span>' + startDate.format('HH:MM') + '</span>')
        .appendTo(this.timeInfo);

    this.timeInfo.appendTo(this.info);

    return this;
};

/**
 * compose time line
 * @return {Gui.Epg.View.Broadcasts.List.Broadcast}
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.addTimeLine = function () {

    var d = new Date();

    if ("undefined" === typeof this.timeLine && this.getStartDate() < d) {

        this.timeLineWrapper = $('<div class="visible-channel-view timeline">');

        $('<div>').text(this.getStartDate().format('HH:MM')).appendTo(this.timeLineWrapper);

        this.timeLine = $('<div>');
        this.timeLine.append($('<div>')).appendTo(this.timeLineWrapper);

        $('<div>').text(this.getEndDate().format('HH:MM')).appendTo(this.timeLineWrapper);

        this.timeLineWrapper.appendTo(this.node);
    }

    return this;
};

/**
 * apply width
 * @return {Gui.Epg.View.Broadcasts.List.Broadcast}
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.setTimeLineWidth = function () {

    if ("undefined" !== typeof this.timeLine) {

        this.timeLine[0].childNodes[0].style.width = this.getTimeLinePercentage() + '%';
    }
    return this;
};

/**
 * calculate width of time line
 * @return {number}
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.getTimeLinePercentage = function () {

    var d = Date.now(),
        start = this.getStartTime() * 1000,
        end = this.getEndTime() * 1000,
        p = 100 * (d - start) / (end - start);

    return p < 0 ? 0 : p > 100 ? 100 : p;
};

/**
 * add menu button
 */
Gui.Epg.View.Broadcasts.List.Broadcast.prototype.addMenuButton = function () {

    this.menuButton = $('<div>').html('&vellip;').addClass('listitem-menu-button visible-channel-view');
    this.menuButton.appendTo(this.node);

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
