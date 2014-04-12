
Gui.Window.Controller.Broadcast = function () {};

Gui.Window.Controller.Broadcast.prototype = new Gui.Window.Controller.Abstract();

/**
 * cache key
 * @type {string}
 */
Gui.Window.Controller.Broadcast.prototype.cacheKey = 'channel/id';

Gui.Window.Controller.Broadcast.prototype.init = function () {

    this.eventPrefix = 'window.' + this.data.channel + '/' + this.data.id;

    this.view = this.module.getView('Broadcast', {
        "id" : this.data.id,
        "channel" : this.data.channel
    });

    Gui.Window.Controller.Abstract.prototype.init.call(this);

    this.module.getViewModel('Broadcast', {
        "id" : this.data.id,
        "channel" : this.data.channel,
        "view" : this.view,
        "resource" : this.data.dataModel
    });
};

Gui.Window.Controller.Broadcast.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    this.addObserver();
};

Gui.Window.Controller.Broadcast.prototype.addObserver = function () {

    var me = this;

    if (this.view.hasImages()) {

        this.view.image.on('click', function () {

            me.view.animateImage();
        });
    }

    Gui.Window.Controller.Abstract.prototype.addObserver.call(this);
};