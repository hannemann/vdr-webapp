/**
 * @class
 * @constructor
 */
Gui.Timer.Controller.List.Timer = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Timer.Controller.List.Timer.prototype = new VDRest.Abstract.Controller();

/**
 * @type {string}
 */
Gui.Timer.Controller.List.Timer.prototype.cacheKey = 'id';

/**
 * initialize view
 */
Gui.Timer.Controller.List.Timer.prototype.init = function () {

    this.eventNameSpace = this.module.namespace + this.module.name;

    this.view = this.module.getView('List.Timer', {
        "id" : this.data.id
    });

    this.view.setParentView(
        this.data.parent.view
    );

    this.dataModel = VDRest.app.getModule('VDRest.Timer').getModel('List.Timer', {
        "id" : this.data.id
    });

    this.module.getViewModel('List.Timer', {
        "id" : this.data.id,
        "view" : this.view,
        "resource": this.dataModel
    });
};

/**
 * dispatch view, init event handling
 */
Gui.Timer.Controller.List.Timer.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * add event listeners
 */
Gui.Timer.Controller.List.Timer.prototype.addObserver = function () {

    this.view.node
        .on(VDRest.helper.pointerStart, this.handleDown.bind(this))
        .on(VDRest.helper.pointerMove, this.handleMove.bind(this))
        .on(VDRest.helper.pointerEnd, this.handleUp.bind(this));

    $document.on('gui-timer.updated.' + this.keyInCache + '.' + this.eventNameSpace, this.update.bind(this));
};

/**
 * remove event listeners
 */
Gui.Timer.Controller.List.Timer.prototype.removeObserver = function () {

    this.view.node.off([
        VDRest.helper.pointerStart,
        VDRest.helper.pointerMove,
        VDRest.helper.pointerEnd
    ].join(' '));

    $document.off('gui-timer.' + this.keyInCache + '.' + this.eventNameSpace);
};


/**
 * handle mouseup
 * @param {jQuery.Event} e
 */
Gui.Timer.Controller.List.Timer.prototype.handleUp = function (e) {

    if (e.cancelable) {
        e.preventDefault();
    }

    if (!this.module.isMuted) {

        if ("undefined" === typeof this.preventClick) {

            this.vibrate();

            if ("undefined" !== typeof this.clickTimeout) {
                window.clearTimeout(this.clickTimeout);
            }
            if (!VDRest.helper.canCancelEvent) {
                this.windowAction(e);
            }
        }
    }
};

/**
 * prevent click on move
 */
Gui.Timer.Controller.List.Timer.prototype.handleMove = function () {

    this.preventClick = true;

    if ("undefined" !== typeof this.clickTimeout) {
        window.clearTimeout(this.clickTimeout);
    }
};

/**
 * handle mousedown
 */
Gui.Timer.Controller.List.Timer.prototype.handleDown = function (e) {

    activeAnimate.applyAnimation(e, this.view.node[0]);

    this.preventClick = undefined;

    //this.clickTimeout = window.setTimeout(function () {
    //    if (!this.module.isMuted) {
    //        this.vibrate(100);
    //        this.preventClick = true;
    //
    //        $document.one(VDRest.helper.isTouchDevice ? 'touchend' : 'mouseup', function () {
    //            if (!VDRest.helper.canCancelEvent) {
    //                this.requestMenuAction();
    //            }
    //        }.bind(this));
    //    }
    //}.bind(this), 1000);
};

/**
 * update data, cache, view
 */
Gui.Timer.Controller.List.Timer.prototype.update = function (e) {

    var timer = e.payload, cache = this.module.cache.store;

    this.data.id = timer.keyInCache;
    this.view.data.id = timer.keyInCache;

    delete cache.Controller['List.Timer'][this.keyInCache];
    delete cache.View['List.Timer'][this.keyInCache];
    delete cache.ViewModel['List.Timer'][this.keyInCache];

    this.keyInCache = timer.keyInCache;
    cache.Controller['List.Timer'][this.keyInCache] = this;

    this.view.keyInCache = timer.keyInCache;
    cache.View['List.Timer'][this.keyInCache] = this.view;

    this.module.getViewModel('List.Timer', {
        "id" : this.data.id,
        "view" : this.view,
        "resource": this.dataModel
    });

    this.removeObserver();
    this.addObserver();

    this.view.update();
};

/**
 * request edit window
 */
Gui.Timer.Controller.List.Timer.prototype.windowAction = function () {

    this.vibrate();
    this.removeObserver();
    $document.one(this.animationEndEvents, function () {
        this.addObserver();
    }.bind(this));

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "type" : "Window.Timer",
            "module" : this.module,
            "data" : {
                "id" : this.dataModel.data.id,
                "resource": this.dataModel
            }
        }
    })
};