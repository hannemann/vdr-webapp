
Gui.Window.Controller.Broadcast = function () {};

Gui.Window.Controller.Broadcast.prototype = new Gui.Window.Controller.Abstract();

/**
 * cache key
 * @type {string}
 */
Gui.Window.Controller.Broadcast.prototype.cacheKey = 'channel/id';

Gui.Window.Controller.Broadcast.prototype.init = function () {

    this.view = this.module.getView('Broadcast', {
        "id" : this.data.id,
        "channel" : this.data.channel
    });

    this.module.getViewModel('Broadcast', {
        "id" : this.data.id,
        "channel" : this.data.channel,
        "view" : this.view,
        "resource" : this.data.dataModel
    });
};