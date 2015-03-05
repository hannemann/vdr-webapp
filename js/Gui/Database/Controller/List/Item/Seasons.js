/**
 * @class
 * @constructor
 */
Gui.Database.Controller.List.Item.Seasons = function () {
};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Database.Controller.List.Item.Seasons.prototype = new Gui.Database.Controller.List.Item.Abstract();

/**
 * @type {boolean}
 */
Gui.Database.Controller.List.Item.Seasons.prototype.type = 'Seasons';

/**
 * add actors
 */
Gui.Database.Controller.List.Item.Seasons.prototype.dispatchView = function () {

    this.seasons = [];

    Gui.Database.Controller.List.Item.Abstract.prototype.dispatchView.call(this);

    this.addObserver();
};

Gui.Database.Controller.List.Item.Seasons.prototype.addObserver = function () {

    this.seasons.forEach(function (season) {
        season.on('click', function () {

            console.log(this);
        }.bind(this));
    }.bind(this));
};
/**
 * add actors
 */
Gui.Database.Controller.List.Item.Seasons.prototype.addSeasons = function () {

    this.getSeasonIds().forEach(function (season) {

        this.seasons.push(this.view.addSeason(season));
    }.bind(this));
};

/**
 * retrieve season numbers
 * @returns {Number[]}
 */
Gui.Database.Controller.List.Item.Seasons.prototype.getSeasonIds = function () {

    var seasons = this.getData('media').getData('episodes').seasons,
        seasonIds = [], i;

    for (i in seasons) {
        if (seasons.hasOwnProperty(i)) {
            seasonIds.push(i);
        }
    }

    return seasonIds.sort();
};