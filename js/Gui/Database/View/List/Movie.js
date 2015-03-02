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

    var maxScreen = VDRest.helper.getMaxScreenResolution("landscape");

    this.addImage('fanart', this.data.media.getImage('fanart'), maxScreen.width)
        .addImage('poster', this.data.media.getImage('poster'), 100)
        .addText('title', this.data.media.getText('title'))
        .addText('tagline', this.data.media.getText('tagline'))
        .addText('genres', this.data.media.getText('genres'))
        .addRating(this.data.media.getRating())
        .addText('overview', this.data.media.getText('overview'))
    ;

    this.addInfoArea();

    this.addText('runtime', this.data.media.getText('runtime'), 'Runtime', 'minutes', this.info)
        .addText('original-title', this.data.media.getText('original_title'), 'Original title', null, this.info)
        .addText('budget', this.data.media.getText('budget'), 'Budget', null, this.info)
        .addText('revenue', this.data.media.getText('revenue'), 'Revenue', null, this.info);

    if (this.data.media.getText('title') !== this.data.media.getText('recording_title')) {
        this.addText('recording-title', this.data.media.getText('recording_title'), 'Recording title', null, this.info);
    }

    this.addText(
        'recording-date',
        VDRest.helper.getDateTimeString(
            new Date(
                parseInt(this.data.media.getData('recording_date'), 10) * 1000
            ),
            true
        ),
        'Recording date', null, this.info);

    Gui.Database.View.List.Item.prototype.render.call(this);
};

/**
 * add an image
 * @param {String} type fanart, poster...
 * @param {String} path
 * @param {Number} [width]
 * @param {Number} [height]
 * @returns {Gui.Database.View.List.Movie}
 */
Gui.Database.View.List.Movie.prototype.addImage = function (type, path, width, height) {

    var resize = "";

    if (width && !height) {
        resize = "width/" + width + "/";
    }

    if (!width && height) {
        resize = "height/" + height + "/";
    }

    if (width && height) {
        resize = "size/" + width + "/" + height + "/";
    }

    if (path) {
        this[type] = $('<img>').attr('src', this.baseImageUrl + resize + path);

        this[type].addClass(type).appendTo(this.node);
    }

    return this;
};
