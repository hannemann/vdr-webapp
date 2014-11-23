/**
 * @class
 * @constructor
 */
Gui.Database.View.Movies = function () {
};

/**
 * @type {Gui.Database.View.List}
 */
Gui.Database.View.Movies.prototype = new Gui.Database.View.List();

Gui.Database.View.Movies.prototype.init = function () {

    this.node = $('<div class="database-collection movies">');
};