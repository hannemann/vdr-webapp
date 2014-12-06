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

    this.node = $('<div id="media-browser" class="fanart-slider">');
    $('body').addClass('database');
};

/**
 * initialize render
 */
Gui.Database.View.Default.prototype.render = function () {

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * destroy
 */
Gui.Database.View.Default.prototype.destruct = function () {
    $('body').removeClass('database');
    VDRest.Abstract.View.prototype.destruct.call(this);
};
