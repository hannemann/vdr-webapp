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

/**
 * @type {string}
 */
Gui.Database.View.List.Item.prototype.symbolPlay = 'C';

/**
 * @type {string}
 */
Gui.Database.View.List.Item.prototype.symbolInfo = 'i';

/**
 * initialize
 */
Gui.Database.View.List.Item.prototype.init = function () {

    this.node = $('<div class="list-item clearer" data-id="' + this.data.media.id + '">');

    this.baseUrl = VDRest.Api.Resource.prototype.getBaseUrl();

    this.baseImageUrl = this.baseUrl + 'scraper/image/';
};

/**
 * render view
 */
Gui.Database.View.List.Item.prototype.render = function () {

    this.addInfoButton()
        .addPlayButton();

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * add text
 * @param {String} type
 * @param {String} text
 * @param {String} [prefix]
 * @param {String} [suffix]
 * @param {jQuery} [wrapper]
 * @returns {Gui.Database.View.List.Item}
 */
Gui.Database.View.List.Item.prototype.addText = function (type, text, prefix, suffix, wrapper) {

    wrapper = wrapper || this.node;

    if (text) {

        if (prefix) {
            text = VDRest.app.translate(prefix) + ': ' + text;
        }

        if (suffix) {
            text += ' ' + VDRest.app.translate(suffix);
        }

        this[type] = $('<div>').html(text);

        this[type].addClass(type + ' item-text').appendTo(wrapper);
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

/**
 * add info area
 * @returns {Gui.Database.View.List.Item}
 */
Gui.Database.View.List.Item.prototype.addInfoArea = function () {

    this.info = $('<div>')
        .addClass('info-area')
        .appendTo(this.node);

    this.node.addClass('hidden-info-area');
    return this;
};

/**
 * add info button
 * @returns {Gui.Database.View.List.Item}
 */
Gui.Database.View.List.Item.prototype.addInfoButton = function () {

    this.ctrlInfo = $(
        '<div class="vdr-web-symbol ctrl-button info">' + this.symbolInfo + '</div>'
    ).appendTo(this.node);
    return this;
};

/**
 * add playback button
 * @returns {Gui.Database.View.List.Item}
 */
Gui.Database.View.List.Item.prototype.addPlayButton = function () {

    this.ctrlPlay = $(
        '<div class="vdr-web-symbol ctrl-button play">' + this.symbolPlay + '</div>'
    ).appendTo(this.node);
    return this;
};
