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

    this.addImage('fanart')
        .addImage('poster')
        .addText('title')
        .addText('tagline')
        .addText('genres')
        .addVoteAverage()
        .addText('overview');

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * add an image
 * @param {String} type fanart, poster...
 * @returns {Gui.Database.View.List.Movie}
 */
Gui.Database.View.List.Movie.prototype.addImage = function (type) {

    if (this.data.media[type] != '') {
        this[type] = $('<img>').attr('src', this.baseImageUrl + this.data.media[type]);

        this[type].addClass(type).appendTo(this.node);
    }

    return this;
};

/**
 * add text
 * @param type
 * @returns {Gui.Database.View.List.Movie}
 */
Gui.Database.View.List.Movie.prototype.addText = function (type) {

    if (this.data.media[type] != '') {
        this[type] = $('<div>').html(this.data.media[type]);

        this[type].addClass(type).appendTo(this.node);
    }

    return this;
};

/**
 * add vote average
 * @returns {Gui.Database.View.List.Movie}
 */
Gui.Database.View.List.Movie.prototype.addVoteAverage = function () {

    var x = 10, star;

    if (this.data.media.vote_average != '') {
        this.voteAverage = $('<div>')
            .html('<span class="vote-numeric">' + this.data.media.vote_average.toPrecision(2) + '</span>');

        for (x; x > 0; x--) {
            star = $('<span>').text('★').prependTo(this.voteAverage);
            if (x <= Math.round(this.data.media.vote_average)) {
                star.addClass('vote');
            }
        }

        this.voteAverage.addClass('vote-average').appendTo(this.node);
    }

    return this;
};
