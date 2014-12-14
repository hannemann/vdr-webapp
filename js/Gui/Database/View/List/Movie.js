/**
 * @class
 * @constructor
 */
Gui.Database.View.List.Movie = function () {
};

/**
 * @type {Gui.Database.View.List.Item}
 */
Gui.Database.View.List.Movie.prototype = new Gui.Database.View.List.Item();

/**
 * render
 */
Gui.Database.View.List.Movie.prototype.render = function () {

    this.addImage('fanart', this.data.media.getImage('fanart'))
        .addImage('poster', this.data.media.getImage('poster'))
        .addText('title', this.data.media.getText('title'))
        .addText('tagline', this.data.media.getText('tagline'))
        .addText('genres', this.data.media.getText('genres'))
        .addRating(this.data.media.getRating())
        .addText('overview', this.data.media.getText('overview'))
    ;

    if (this.data.media.getText('title') !== this.data.media.getText('recording_title')) {
        this.addText('recording-title', VDRest.app.translate('Recording title') + ': ' + this.data.media.getText('recording_title'));
    }

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * add an image
 * @param {String} type fanart, poster...
 * @param {String} path
 * @returns {Gui.Database.View.List.Movie}
 */
Gui.Database.View.List.Movie.prototype.addImage = function (type, path) {

    if (path) {
        this[type] = $('<img>').attr('src', this.baseImageUrl + path);

        this[type].addClass(type).appendTo(this.node);
    }

    return this;
};
