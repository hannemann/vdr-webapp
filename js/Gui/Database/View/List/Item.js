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
