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


    this.addName().addPath().addshortText();

    if (!this.date) {
        this.date = $('<span class="date">')
            .text(this.getStartDate())
            .appendTo(this.node);
    }

    if (!this.time) {
        this.time = $('<span class="time">')
            .text(this.getStartTime())
            .appendTo(this.node);
    }

    if (!this.duration) {
        this.duration = $('<span class="duration">')
            .text(this.getDurationString())
            .appendTo(this.node);
    }

    this.addClasses();

    if (isNaN(this.position)) {

        this.node.appendTo(this.parentView.node);
    } else {

        this.node.insertBefore(this.parentView.node.find('.recording:nth(' + this.position + ')'));
        delete this.position;
    }

    this.isRendered = !this.isRendered;
};


/**
 * add name node
 */
Gui.Recordings.View.List.Recording.prototype.addName = function () {

    if (! this.name) {

        this.name = $('<div class="name">').appendTo(this.node);
    }
    this.name.text(this.getName().split('~').pop());

    return this;
};

/**
 * add path node
 */
Gui.Recordings.View.List.Recording.prototype.addPath = function () {

    var path = this.getName().split('~').slice(0, -1);

    if (path.length > 0) {

        if (!this.path) {

            this.path = $('<div class="path">');

            if (this.name) {

                this.path.insertBefore(this.name);

            } else {
                this.path.appendTo(this.node);
            }
        }

        this.path.text(path.join('/'));

    } else if (this.path) {

        this.path.remove();
        this.path = undefined;
    }

    return this;
};

/**
 * add shortText
 */
Gui.Recordings.View.List.Recording.prototype.addshortText = function () {

    if (!this.shortText && this.hasEventShortText()) {

        this.shortText = $('<div class="shortText italic">');
    }

    if (this.hasEventShortText()) {

        this.shortText.text(this.getEventShortText()).appendTo(this.name);

    } else if (this.shortText) {

        this.shortText.remove();

        delete this.shortText;
    }

    return this;
};

/**
 * add classes to node
 * @returns {Gui.Recordings.View.List.Recording}
 */
Gui.Recordings.View.List.Recording.prototype.addClasses = function () {

    var classNames = [], rating = this.getRating();

    if (this.getIsNew()) {

        this.name.addClass('is-new');
    }

    if (this.getIsEdited()) {

        this.name.addClass('edited');
    }

    if (rating) {

        this.name.addClass('rating-' + rating);
    }

    if (this.getTopTip()) {

        this.name.addClass('top-tipp');
    }

    this.node.addClass(classNames.join(' '));
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
    this.date.remove();
    delete this.date;
    this.duration.remove();
    delete this.duration;
    VDRest.Abstract.View.prototype.destruct.call(this);
    delete this.node;
    delete this.data;
};
