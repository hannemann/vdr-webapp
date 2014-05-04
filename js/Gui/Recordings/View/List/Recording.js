
Gui.Recordings.View.List.Recording = function () {};

Gui.Recordings.View.List.Recording.prototype = new VDRest.Abstract.View();

Gui.Recordings.View.List.Recording.prototype.cacheKey = 'number';

Gui.Recordings.View.List.Recording.prototype.init = function () {

    this.node = $('<div class="recording list-item clearer">');
};

Gui.Recordings.View.List.Recording.prototype.render = function () {


    if (! this.name) {
        this.name = $('<div class="name">')
            .text(this.getName())
            .appendTo(this.node);

    }
    if (!this.shortText && this.hasEventShortText()) {

        this.shortText = $('<div class="shortText italic">')
            .text(this.getEventShortText())
            .appendTo(this.name);
    }

    if (!this.date) {
        this.date = $('<span class="date">')
            .text(this.getStartDate())
            .appendTo(this.node);
    }

    if (!this.duration) {
        this.duration = $('<span class="time">')
            .text(this.getDurationString())
            .appendTo(this.node);
    }

    this.addClasses();

    VDRest.Abstract.View.prototype.render.call(this);
};

Gui.Recordings.View.List.Recording.prototype.addClasses = function () {

    var classNames = [], rating = this.getRating();

    if (rating) {

        this.name.addClass('rating-' + rating);
    }

    if (this.getTopTip()) {

        this.name.addClass('top-tipp');
    }

    this.node.addClass(classNames.join(' '));
    return this;
};