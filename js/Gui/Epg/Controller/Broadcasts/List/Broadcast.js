/**
 * @class
 * @constructor
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype = new VDRest.Abstract.Controller();

/**
 * @type {string}
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.cacheKey = 'channel/id';

/**
 * @type {boolean}
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.isVisible = true;

/**
 * initialize view
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.init = function () {

    this.eventNameSpace = this.module.namespace + '-' + this.module.name;

    this.epgController = this.module.cache.store.Controller.Epg;

    this.windowModule = this.module;

    if (this.data.dataModel.data.timer_exists) {
        this.module.store.getModel('Observer').registerTimer(this.data.dataModel);
    }

    this.view = this.module.getView('Broadcasts.List.Broadcast', {
        "id" : this.data.id,
        "channel" : this.data.channel,
        "listController": this.data.parent,
        "position": this.data.position
    });
    this.view.setParentView(this.data.parent.view);

    this.module.getViewModel('Broadcasts.List.Broadcast', {
        "id" : this.data.id,
        "channel" : this.data.channel,
        "view" : this.view,
        "resource" : this.data.dataModel
    });

    this.view.decorate();
};

/**
 * determine if broadcast is currently visible
 * @returns {boolean}
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.isInView = function () {

    var metrics = this.epgController.getMetrics(),
        parentOffset = this.view.parentView.node.offset(),
        left = this.view.getLeft() + parentOffset.left,
        right = this.view.getRight() + parentOffset.left;

    return left < metrics.win.width && right > metrics.broadcasts.left;
};

Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.updateMetrics = function () {

    this.module.getViewModel('Broadcasts.List.Broadcast', this.keyInCache).calculateMetrics();
    this.view.needsUpdate = true;

    return this;
};

/**
 * request window
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.requestWindowAction = function () {

    $.event.trigger({
        "type" : 'window.request',
        "payload" : {
            "module" : this.windowModule,
            "type" : "Window.Broadcast",
            "data" : this.data
        }
    })
};

/**
 * handle click on timer add/delete button
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.handleTimer = function () {

    this.view.handleTimerExists(this.data.dataModel.data.timer_exists);
    this.view.handleTimerActive(this.data.dataModel.data.timer_active);
    this.view.handleIsRecording(this.view.getIsRecording());
};
