
Gui.Epg.Controller.Broadcasts.List.Broadcast = function () {};

Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype = new VDRest.Abstract.Controller();

Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.cacheKey = 'channel/id';

Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.init = function () {

    this.epgController = this.module.getController('Epg');

    this.view = this.module.getView('Broadcasts.List.Broadcast', {
        "id" : this.data.id,
        "channel" : this.data.channel
    });
    this.view.setParentView(this.data.parent.view);

    this.module.getViewModel('Broadcasts.List.Broadcast', {
        "id" : this.data.id,
        "channel" : this.data.channel,
        "view" : this.view,
        "resource" : this.data.dataModel
    });

    this.view.decorate();

    this.addObserver();
};

Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.isInView = function () {

    var metrics = this.epgController.getMetrics(),
        parentOffset = this.view.parentView.node.offset(),
        left = this.view.getLeft() + parentOffset.left,
        right = this.view.getRight() + parentOffset.left;

    return left < metrics.win.width && right > metrics.broadcasts.left;
};

Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.addObserver = function () {

    this.view.node.on('click', $.proxy(this.handleClick, this));
    $(document).on('timer-changed.' + this.keyInCache, $.proxy(this.handleTimer, this));
};

Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.removeObserver = function () {

    this.view.node.off('click', $.proxy(this.handleClick, this));
    $(document).off('timer-changed.' + this.keyInCache, $.proxy(this.handleTimer, this));
};

Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.handleClick = function () {

    $.event.trigger({
        "type" : 'window.request',
        "payload" : {
            "type" : "Broadcast",
            "data" : this.data
        }
    })
};

Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.handleTimer = function () {

    this.view.handleTimerExists(this.data.dataModel.data.timer_exists);
    this.view.handleTimerActive(this.data.dataModel.data.timer_active);
};