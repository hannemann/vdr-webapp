/**
 * @class
 * @constructor
 */
Gui.Database.View.List.Show = function () {
};

/**
 * @type {Gui.Database.View.List.Item}
 */
Gui.Database.View.List.Show.prototype = new Gui.Database.View.List.Item();

/**
 * render
 */
Gui.Database.View.List.Show.prototype.render = function () {

    this.addImage('fanart', this.data.media.getImage('fanarts', 0))
        .addImage('poster', this.data.media.getImage('posters', 0))
        .addText('name', this.data.media.getText('name'))
        //.addText('network', this.data.media.getText('network'))
        .addText('genre', this.data.media.getText('genre'))
        .addRating(this.data.media.getRating())
        .addText('overview', this.data.media.getText('overview'))
    ;

    Gui.Database.View.List.Item.prototype.render.call(this);
};

/**
 * add an image
 * @param {String} type fanart, poster...
 * @param {{String path, Number height, Number width}} image
 * @returns {Gui.Database.View.List.Movie}
 */
Gui.Database.View.List.Show.prototype.addImage = function (type, image) {

    if (image && image.path && image.image != '') {
        this[type] = $('<img>').attr('src', this.baseImageUrl + image.path);

        this[type].addClass(type).appendTo(this.node);
    }

    return this;
};
