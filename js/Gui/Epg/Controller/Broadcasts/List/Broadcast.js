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

    this.epgController = this.module.getController('Epg');

    this.windowModule = this.module;

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

    this.addObserver();
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
 * add event listeners
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.addObserver = function () {

    $document.on('gui-timer.created.' + this.keyInCache + '.' + this.eventNameSpace, this.handleTimer.bind(this));
    $document.on('gui-timer.updated.' + this.keyInCache + '.' + this.eventNameSpace, this.handleTimer.bind(this));

    if (this.data.dataModel.data.timer_id) {

        $document.one('gui-timer.deleted.'
            + [this.keyInCache, this.data.dataModel.data.timer_id, this.eventNameSpace].join('.'),
            this.handleTimer.bind(this)
        );
    }
};

/**
 * remove event listeners
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.removeObserver = function () {

    $document.off('gui-timer.created.' + this.keyInCache + '.' + this.eventNameSpace);
    $document.off('gui-timer.updated.' + this.keyInCache + '.' + this.eventNameSpace);
    $document.off('gui-timer.deleted.' + [
        this.keyInCache,
        this.data.dataModel.data.timer_id,
        this.eventNameSpace
    ].join('.'));
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

    if (this.data.dataModel.data.timer_exists) {

        $document.one(
            'gui-timer.deleted.' + this.keyInCache + '.' + this.eventNameSpace,
            this.handleTimer.bind(this)
        );
    }

    this.view.handleTimerExists(this.data.dataModel.data.timer_exists);
    this.view.handleTimerActive(this.data.dataModel.data.timer_active);
    this.view.handleIsRecording(this.view.getIsRecording());
};
