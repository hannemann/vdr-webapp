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


Gui.Database.View.List.Movie.prototype.render = function () {

    this.addPoster().addTitle();

    VDRest.Abstract.View.prototype.render.call(this);
};

Gui.Database.View.List.Movie.prototype.addPoster = function () {

    this.poster = $('<img>').attr('src', this.baseImageUrl + this.data.media.poster);

    this.poster.addClass('poster').appendTo(this.node);

    return this;
};

Gui.Database.View.List.Movie.prototype.addTitle = function () {

    this.title = $('<div>').html(this.data.media.title);

    this.title.addClass('title').appendTo(this.node);

    return this;
};