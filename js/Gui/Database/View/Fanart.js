/**
 * @class
 * @constructor
 */
Gui.Database.View.Fanart = function () {
};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Database.View.Fanart.prototype = new VDRest.Abstract.View();

/**
 * @type {String}
 */
Gui.Database.View.Fanart.prototype.cacheKey = 'id';

/**
 * initialize node
 */
Gui.Database.View.Fanart.prototype.init = function () {

    this.node = $('<div class="fanart ' + this.data.type + '">');
};

/**
 * render fanart
 */
Gui.Database.View.Fanart.prototype.render = function () {

    this.addImage().addHeader();

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * add image
 */
Gui.Database.View.Fanart.prototype.addImage = function () {

    this.image = $('<img class="fanart-collage">')
        .attr('src', this.getData('data_url'))
        .appendTo(this.node);

    return this;
};

/**
 * update image
 */
Gui.Database.View.Fanart.prototype.updateImage = function () {

    this.image.attr('src', this.getData('data_url'));
};

/**
 * add heading
 */
Gui.Database.View.Fanart.prototype.addHeader = function () {

    this.header = $('<div class="fanart-h1">')
        .text(VDRest.app.translate(this.data.header))
        .appendTo(this.node);

    return this;
};

/**
 * add spinner
 * @returns {Gui.Database.View.Fanart}
 */
Gui.Database.View.Fanart.prototype.addThrobber = function () {

    this.throbber = $('<div style="background-image: url(' + VDRest.image.getThrobber() + ')">')
        .addClass('throbber show center has-background ')
        .appendTo(this.node);

    return this;
};

/**
 * add spinner
 * @returns {Gui.Database.View.Fanart}
 */
Gui.Database.View.Fanart.prototype.removeThrobber = function () {

    this.throbber.remove();

    return this;
};