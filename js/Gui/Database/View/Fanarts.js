/**
 * @class
 * @constructor
 */
Gui.Database.View.Fanarts = function () {
};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Database.View.Fanarts.prototype = new VDRest.Abstract.View();

/**
 * @type {String}
 */
Gui.Database.View.Fanarts.prototype.cacheKey = 'id';

/**
 * initialize node
 */
Gui.Database.View.Fanarts.prototype.init = function () {

    this.node = $('<div class="fanart ' + this.data.type + '">');
};

/**
 * render fanart
 */
Gui.Database.View.Fanarts.prototype.render = function () {

    this.addImage().addHeader();

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * add image
 */
Gui.Database.View.Fanarts.prototype.addImage = function () {

    this.image = $('<img class="fanart-collage">')
        .attr('src', this.getData('data_url'))
        .appendTo(this.node);

    return this;
};

/**
 * update image
 */
Gui.Database.View.Fanarts.prototype.updateImage = function () {

    this.image.attr('src', this.getData('data_url'));
};

/**
 * add heading
 */
Gui.Database.View.Fanarts.prototype.addHeader = function () {

    this.header = $('<div class="fanart-h1">')
        .text(VDRest.app.translate(this.data.header))
        .appendTo(this.node);

    return this;
};