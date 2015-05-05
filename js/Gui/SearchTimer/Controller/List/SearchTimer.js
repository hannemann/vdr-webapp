/**
 * @class
 * @constructor
 */
Gui.SearchTimer.Controller.List.SearchTimer = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype = new VDRest.Abstract.Controller();

/**
 * @type {string}
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.cacheKey = 'id';

/**
 * initialize view
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.init = function () {

    this.eventNameSpace = this.module.namespace + this.module.name;

    this.view = this.module.getView('List.SearchTimer', {
        "id" : this.data.id
    });

    this.view.setParentView(
        this.data.parent.view
    );

    this.module.getViewModel('List.SearchTimer', {
        "id" : this.data.id,
        "view" : this.view,
        "resource": this.data.dataModel
    });
};

/**
 * dispatch view, init event handling
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * add event listeners
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.addObserver = function () {

    this.view.node.on('click', this.requestWindowAction.bind(this));

    if (VDRest.helper.isTouchDevice) {
        this.view.node
            .on('touchend', this.handleUp.bind(this))
            .on('touchmove', this.handleMove.bind(this))
            .on('touchstart', this.handleDown.bind(this))
        ;
        this.view.menuButton.on('touchstart', this.requestMenuAction.bind(this));
    } else {
        this.view.node
            .on('mouseup', this.handleUp.bind(this))
            .on('mousedown', this.handleDown.bind(this))
        ;
        this.view.menuButton.on('mousedown', this.requestMenuAction.bind(this));
    }

    $document.on('gui-searchtimer.updated.' + this.keyInCache, this.view.decorate.bind(this.view));
};

/**
 * remove event listeners
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.removeObserver = function () {

    this.view.node.off('click touchend touchstart touchmove mouseup mousedown');

    $document.off('gui-searchtimer.updated.' + this.keyInCache);
    this.view.menuButton.off('click');
};


/**
 * handle mouseup
 * @param {jQuery.Event} e
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.handleUp = function (e) {

    e.preventDefault();

    if (!this.module.isMuted) {

        if ("undefined" === typeof this.preventClick) {

            this.vibrate();

            if ("undefined" !== typeof this.clickTimeout) {
                window.clearTimeout(this.clickTimeout);
            }
            this.requestWindowAction(e)
        }
    }
    document.onselectstart = function () {
        return true
    };
};

/**
 * prevent click on move
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.handleMove = function () {

    this.preventClick = true;

    if ("undefined" !== typeof this.clickTimeout) {
        window.clearTimeout(this.clickTimeout);
    }
};

/**
 * handle mousedown
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.handleDown = function () {

    document.onselectstart = function () {
        return false
    };

    this.preventClick = undefined;

    this.clickTimeout = window.setTimeout(function () {
        if (!this.module.isMuted) {
            this.vibrate(100);
            this.preventClick = true;
            this.requestMenuAction();
        }
    }.bind(this), 500);
};

/**
 * request edit window
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.requestWindowAction = function (e) {

    e.preventDefault();

    this.vibrate();

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "type" : "SearchTimer",
            "data" : {
                "id": this.data.dataModel.data.id,
                "resource": this.data.dataModel,
                "onsubmit": this.saveAction.bind(this)
            }
        }
    })
};

/**
 * request edit window
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.requestMenuAction = function (e) {

    var toggleLabel = (this.data.dataModel.data.use_as_searchtimer == 0 ? 'A' : 'Dea') + 'ctivate';

    if (e) {
        e.stopPropagation();
    }

    this.preventClick = true;

    $.event.trigger({
        "type": "window.request",
        "payload": {
            "type": "ItemMenu",
            "data": {
                "config": {
                    "header": this.data.dataModel.data.search,
                    "buttons": {
                        "toggle": {
                            "label": VDRest.app.translate(toggleLabel),
                            "fn": this.toggleActiveAction.bind(this)
                        },
                        "delete": {
                            "label": VDRest.app.translate('Delete'),
                            "fn": this.deleteAction.bind(this)
                        },
                        "search": {
                            "label": VDRest.app.translate('Perform search'),
                            "fn": this.performSearchAction.bind(this)
                        },
                        "timers": {
                            "label": VDRest.app.translate('Show Timers'),
                            "fn": this.showTimersAction.bind(this)
                        }
                    }
                }
            }
        }
    })
};

Gui.SearchTimer.Controller.List.SearchTimer.prototype.saveAction = function (fields) {

    this.data.dataModel.save(fields);
};

Gui.SearchTimer.Controller.List.SearchTimer.prototype.toggleActiveAction = function () {

    this.data.dataModel.toggleActive();
};

Gui.SearchTimer.Controller.List.SearchTimer.prototype.deleteAction = function () {

    this.data.dataModel.deleteSearchTimer();
};

Gui.SearchTimer.Controller.List.SearchTimer.prototype.performSearchAction = function () {

    this.data.dataModel.performSearch();
};

Gui.SearchTimer.Controller.List.SearchTimer.prototype.showTimersAction = function () {

    var controller = VDRest.app.getModule('Gui.Timer').getController('List'),
        callback = function () {
            controller.destructView();
            this.module.dispatch();
        }.bind(this);

    VDRest.app.saveHistoryState(
        'SearchTimer.ShowTimers.hashChanged',
        callback,
        this.module.name + '-ShowTimer' + this.data.id
    );

    controller.applySearchTimerFilter(this.data.id)
        .dispatchView();

    this.module.destruct();
};