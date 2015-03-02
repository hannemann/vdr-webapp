/**
 * @class
 * @constructor
 */
Gui.Database.View.List.Item.Actors = function () {
};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Database.View.List.Item.Actors.prototype = new VDRest.Abstract.View();

/**
 * @type {boolean}
 */
Gui.Database.View.List.Item.Actors.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Database.View.List.Item.Actors.prototype.init = function () {

    this.node = $('<div class="item-actors clearer">');

    this.baseUrl = VDRest.Api.Resource.prototype.getBaseUrl();
};

/**
 * render view
 */
Gui.Database.View.List.Item.Actors.prototype.render = function () {

    VDRest.Abstract.View.prototype.render.call(this);
};
