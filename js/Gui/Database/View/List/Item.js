/**
 * @class
 * @constructor
 */
Gui.Database.View.List.Item = function () {
};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Database.View.List.Item.prototype = new VDRest.Abstract.View();

Gui.Database.View.List.Item.prototype.bypassCache = true;

Gui.Database.View.List.Item.prototype.init = function () {

    this.node = $('<div class="list-item clearer">');

    this.baseUrl = VDRest.Api.Resource.prototype.getBaseUrl();

    this.baseImageUrl = this.baseUrl + 'scraper/image/';
};

/**
 * add text
 * @param {String} type
 * @param {String} text
 * @returns {Gui.Database.View.List.Item}
 */
Gui.Database.View.List.Item.prototype.addText = function (type, text) {

    if (text) {
        this[type] = $('<div>').html(text);

        this[type].addClass(type).appendTo(this.node);
    }

    return this;
};

/**
 * add vote average
 * @param {Number} rating
 * @returns {Gui.Database.View.List.Item}
 */
Gui.Database.View.List.Item.prototype.addRating = function (rating) {

    var x = 10, star;

    if (rating) {
        this.voteAverage = $('<div>')
            .html('<span class="vote-numeric">' + rating + '</span>');

        for (x; x > 0; x--) {
            star = $('<span>').text('★').prependTo(this.voteAverage);
            if (x <= Math.round(rating)) {
                star.addClass('vote');
            }
        }

        this.voteAverage.addClass('rating').appendTo(this.node);
    }

    return this;
};
