/**
 * @class
 * @constructor
 */
Gui.Database.View.List.Item.Seasons = function () {
};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Database.View.List.Item.Seasons.prototype = new Gui.Database.View.List.Item.Abstract();

/**
 * nodes class name
 */
Gui.Database.View.List.Item.Seasons.prototype.className = 'seasons';

/**
 * render season buttons
 */
Gui.Database.View.List.Item.Seasons.prototype.addSeason = function (season) {

    var button = $(
        '<div class="vdr-web-symbol ctrl-button season">' + season + '</div>'
    );

    button.attr('data-season', season).appendTo(this.node);

    return button;
};
