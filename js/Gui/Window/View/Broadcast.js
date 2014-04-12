
Gui.Window.View.Broadcast = function () {};

Gui.Window.View.Broadcast.prototype = new Gui.Window.View.Abstract();

/**
 * cache key
 * @type {string}
 */
Gui.Window.View.Broadcast.prototype.cacheKey = 'channel/id';


Gui.Window.View.Broadcast.prototype.render = function () {

    console.log(this.getTitle());
};