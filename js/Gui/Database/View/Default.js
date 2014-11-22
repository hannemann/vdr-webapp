/**
 * @class
 * @constructor
 */
Gui.Database.View.Default = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Database.View.Default.prototype = new VDRest.Abstract.View();

/**
 * init nodes
 */
Gui.Database.View.Default.prototype.init = function () {

    this.node = $('<div id="media-browser">');
    $('body').addClass('database');
};

/**
 * initialize render
 */
Gui.Database.View.Default.prototype.render = function () {

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * add fanart
 */
Gui.Database.View.Default.prototype.addFanarts = function () {

    this.moviesFanart = $('<img>')
        .attr('src', this.getData('movies_fanart_collage'))
        .attr('id', 'movie-fanart')
        .appendTo(this.node);

    $('<div class="fanart-h1 movies">').text(VDRest.app.translate('Movies')).appendTo(this.node);

    this.showsFanart = $('<img>')
        .attr('src', this.getData('shows_fanart_collage'))
        .attr('id', 'show-fanart')
        .appendTo(this.node);

    $('<div class="fanart-h1 shows">').text(VDRest.app.translate('TV-Shows')).appendTo(this.node);
};

/**
 * add fanart
 */
Gui.Database.View.Default.prototype.updateFanart = function (type) {

    this[type.replace(/^([a-z]*)_.*/, "$1") + 'Fanart'].attr('src', this.getData(type));
};

/**
 * add fanart
 */
Gui.Database.View.Default.prototype.destruct = function (type) {
    $('body').removeClass('database');
    VDRest.Abstract.View.prototype.destruct.call(this);
};
