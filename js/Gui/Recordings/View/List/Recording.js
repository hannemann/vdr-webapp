/**
 * @class
 * @constructor
 */
Gui.Recordings.View.List.Recording = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Recordings.View.List.Recording.prototype = new VDRest.Abstract.View();

/**
 * @type {string}
 */
Gui.Recordings.View.List.Recording.prototype.cacheKey = 'file_name';

/**
 * initialize node
 */
Gui.Recordings.View.List.Recording.prototype.init = function () {

    this.node = $('<div class="recording list-item clearer">');
};

/**
 * render
 */
Gui.Recordings.View.List.Recording.prototype.render = function () {

    if (!this.content && (this.hasEventDescription() || this.hasEventShortText())) {
        this.content = $('<div class="content">')
            .appendTo(this.node);
    }

    this.addImage()
        .addName()
        .addPath()
        .addshortText()
        .addDescription()
        .addQuickInfo()
        .addClasses()
        .addMenuButton()
    ;

    if (isNaN(this.position)) {

        this.node.appendTo(this.parentView.node);
    } else {

        this.node.insertBefore(this.parentView.node.find('.recording:nth(' + this.position + ')'));
        delete this.position;
    }

    this.isRendered = !this.isRendered;
};

/**
 * add path node
 */
Gui.Recordings.View.List.Recording.prototype.addPath = function () {

    var path = this.getName().split('~').slice(0, -1);

    if (path.length > 0) {

        if (!this.path) {

            this.path = $('<div class="path">').prependTo(this.node);
        }

        this.path.text(path.join('/'));

    } else if (this.path) {

        this.path.remove();
        this.path = undefined;
    }

    return this;
};

/**
 * add name node
 */
Gui.Recordings.View.List.Recording.prototype.addName = function () {

    if (!this.name) {

        this.name = $('<div class="name">').prependTo(this.node);
    }
    this.name.text(this.getName().split('~').pop());

    return this;
};

/**
 * add image
 * @type {additionalMediaMovie} media
 * @returns {Gui.Recordings.View.List.Recording}
 */
Gui.Recordings.View.List.Recording.prototype.addImage = function () {

    var img, src, width;

    if (!this.image) {

        width = window.matchMedia('(orientation: landscape)').matches
            ? parseInt(window.innerWidth / 100 * 19.5 - 10, 10)
            : parseInt(window.innerWidth / 100 * 33 - 10, 10);

        src = this.getEpisodeImage(width) || this.getFanart(width);

        if (src) {

            img = $('<img>').attr('src', src);

            this.image = $('<div class="recordings-image">')
                .append(img).prependTo(this.node);

            this.node.addClass('has-image');
        }
    }

    return this;
};

/**
 * add shortText
 */
Gui.Recordings.View.List.Recording.prototype.addshortText = function () {

    var text = '';

    if (!this.shortText && this.hasEventShortText()) {

        this.shortText = $('<div class="shortText italic">');
        text = this.getEventShortText();
        if (this.hasDuration()) {
            text += ' ' + this.getDurationString();
        }

        this.shortText.text(text).appendTo(this.content);

    } else if (this.shortText) {

        this.shortText.remove();
        delete this.shortText;
    }

    return this;
};

/**
 * add shortText
 */
Gui.Recordings.View.List.Recording.prototype.addDescription = function () {

    if (!this.description && this.hasEventDescription()) {

        this.description = $('<div class="description">');
    }

    if (this.hasEventDescription()) {

        this.description.text(this.getEventDescription()).appendTo(this.content);

    } else if (this.description) {

        this.description.remove();

        delete this.description;
    }

    return this;
};

/**
 * add quick info bar
 */
Gui.Recordings.View.List.Recording.prototype.addQuickInfo = function () {

    var rating = this.getRating(),
        symbols = $('<span class="symbols">'),
        tipClassName = '',
        ratingSpan = $('<span class="rating">');

    if (!this.quickInfo) {

        this.isTip = this.getTip() || this.getTopTip() || this.getTipOfTheDay();
        this.quickInfo = $('<div class="quick-info">');
        this.quickInfo
            .append(symbols)
            .append(ratingSpan);

        if (this.isTip) {

            if (this.getTip()) {
                tipClassName = 'tip';
            }

            if (this.getTopTip()) {
                tipClassName = 'top-tip';
            }

            if (this.getTipOfTheDay()) {
                tipClassName = 'tip-of-the-day';
            }
            $('<span class="tip">').text('Y').addClass(tipClassName).appendTo(symbols);
        }

        if (this.getIsNew()) {
            $('<span class="is-new">').text('K').appendTo(symbols);
        }

        if (this.getIsEdited()) {
            $('<span class="is-edited">').text('Z').appendTo(symbols);
        }

        if (rating && rating > 0) {
            ratingSpan.html(
                '<span>' + new Array(rating + 1).join('*') + '</span><span>' + new Array(5 - rating + 1).join('*') + '</span>'
            );
        }

        if (!this.dateTime) {
            this.dateTime = $('<span class="date-time">')
                .text(this.getStartDateTime())
                .appendTo(this.quickInfo);
        }

        this.quickInfo.appendTo(this.node);
    }

    return this;
};

/**
 * add classes to node
 * @returns {Gui.Recordings.View.List.Recording}
 */
Gui.Recordings.View.List.Recording.prototype.addClasses = function () {

    var classNames = [];

    this.node.addClass(classNames.join(' '));
    return this;
};

/**
 * add channels
 */
Gui.Recordings.View.List.Recording.prototype.addMenuButton = function () {

    if (!this.menuButton) {
        this.menuButton = $('<div>').html('&vellip;').addClass('listitem-menu-button');
        this.menuButton.appendTo(this.node);
    }

    return this;
};

/**
 * handle updates
 */
Gui.Recordings.View.List.Recording.prototype.update = function () {

    this.addName().addPath().addshortText();

    return this;
};

Gui.Recordings.View.List.Recording.prototype.destruct = function () {

    this.name.remove();
    delete this.name;
    if (this.path) {
        this.path.remove();
        delete this.path;
    }
    if (this.shortText) {
        this.shortText.remove();
        delete this.shortText;
    }
    if (this.description) {
        this.description.remove();
        delete this.description;
    }
    if (this.content) {
        this.content.remove();
        delete this.content;
    }
    if (this.image) {
        this.image.remove();
        delete this.image;
    }
    if (this.quickInfo) {
        this.quickInfo.remove();
        delete this.quickInfo;
    }
    if (this.menuButton) {
        this.menuButton.remove();
        delete this.menuButton;
    }
    VDRest.Abstract.View.prototype.destruct.call(this);
    delete this.node;
    delete this.data;
};
