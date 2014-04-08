
Gui.Epg.View.Broadcasts.List = function () {};

Gui.Epg.View.Broadcasts.List.prototype = new VDRest.Abstract.View();

Gui.Epg.View.Broadcasts.List.prototype.cacheKey = 'channel_id';

/**
 * @var {jQuery} node
 */
Gui.Epg.View.Broadcasts.List.prototype.init = function () {

    this.node = $('<div class="broadcasts-list">');
};