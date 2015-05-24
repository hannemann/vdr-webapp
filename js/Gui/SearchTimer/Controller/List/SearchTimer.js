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
                this.requestWindowAction(e);
            }
        }
    }
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
Gui.SearchTimer.Controller.List.SearchTimer.prototype.handleDown = function (e) {

    activeAnimate.applyAnimation(e, this.view.node[0]);

    this.preventClick = undefined;

    this.clickTimeout = window.setTimeout(function () {
        if (!this.module.isMuted) {
            this.vibrate(100);
            this.preventClick = true;

            $document.one(VDRest.helper.isTouchDevice ? 'touchend' : 'mouseup', function () {
                if (!VDRest.helper.canCancelEvent) {
                    this.requestMenuAction();
                }
            }.bind(this));
        }
    }.bind(this), 1000);
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
            "type" : "Window.SearchTimer",
            "module" : this.module,
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
                        "template": {
                            "label": VDRest.app.translate('Save as Template'),
                            "fn": this.saveAsTemplateAction.bind(this)
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
                        },
                        "recordings": {
                            "label": VDRest.app.translate('Show Recordings'),
                            "fn": this.showRecordingssAction.bind(this)
                        },
                        "bulkdelete": {
                            "label": VDRest.app.translate('Delete created Timers'),
                            "fn": this.bulkDeleteTimersAction.bind(this)
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

Gui.SearchTimer.Controller.List.SearchTimer.prototype.saveAsTemplateAction = function () {

    var data = {
        "type": "string",
        "dom": $('<label class="clearer text">'),
        "value" : this.data.dataModel.data.search
    };

    $('<span>').text(VDRest.app.translate('Enter name')).appendTo(data.dom);

    data.gui = $('<input type="text" name="template-name">')
        .appendTo(data.dom);
    data.gui.val(data.value);

    data.gui.one('change', function (e) {
        this.module.store.getModel('Templates').saveAsTemplate(this.data.dataModel, e.target.value);
    }.bind(this));

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "module" : VDRest.app.getModule('Gui.Form'),
            "type" : "Window.Input",
            "data" : data
        }
    });
};

Gui.SearchTimer.Controller.List.SearchTimer.prototype.deleteAction = function () {

    this.data.dataModel.deleteSearchTimer();
};

Gui.SearchTimer.Controller.List.SearchTimer.prototype.performSearchAction = function () {

    this.data.dataModel.performSearch();
};

Gui.SearchTimer.Controller.List.SearchTimer.prototype.showTimersAction = function () {

    var module = VDRest.app.getModule('Gui.Timer'),
        controller,
        state = this.module.getView('List').node[0].scrollTop,
        callback = function () {
            module.destruct();
            this.module.dispatch();
            this.module.getView('List').node[0].scrollTop = state;
        }.bind(this);

    module.flush();
    controller = module.getController('List');

    VDRest.app.saveHistoryState(
        'SearchTimer.ShowTimers.hashChanged',
        callback,
        this.module.name + '-ShowTimer' + this.data.id
    );

    controller.applySearchTimerFilter(this.data.id)
        .dispatchView();

    this.module.destruct();
};

Gui.SearchTimer.Controller.List.SearchTimer.prototype.showRecordingssAction = function () {

    var dataModel = VDRest.app.getModule('VDRest.Recordings').getModel('List'),
        collection = dataModel.getCollection();

    if (collection.length > 0) {

        this.dispatchRecordings({
            "iterate": dataModel.resultIterator.bind(dataModel),
            "collection": collection
        });
    } else {

        $window.one('recordingsloaded', this.dispatchRecordings.bind(this));

        dataModel.initList();
    }
};

Gui.SearchTimer.Controller.List.SearchTimer.prototype.dispatchRecordings = function (collection) {

    var controller = this.module.getController('List');
    collection.sid = this.data.id;
    controller.dispatchRecordings(collection);
};

Gui.SearchTimer.Controller.List.SearchTimer.prototype.bulkDeleteTimersAction = function () {

    var dataModel = VDRest.app.getModule('VDRest.Timer').getModel('List'),
        collection = dataModel.getCollection();

    if (collection.length > 0) {

        this.deleteCollection(collection);
    } else {

        $window.one('timersloaded', this.deleteCollection.bind(this));

        dataModel.initList();
    }
};

Gui.SearchTimer.Controller.List.SearchTimer.prototype.deleteCollection = function (collection) {

    var idsToDelete = [];

    if (collection instanceof jQuery.Event) {
        collection = collection.collection;
        if (!collection instanceof Array) return false;
    }

    collection.forEach(function (timer) {
        if (timer.isCreatedBySearchTimer(this.data.id)) {
            idsToDelete.push(timer.data.id);
        }
    }.bind(this));

    VDRest.app.getModule('VDRest.Timer').getModel('List').bulkDelete(idsToDelete);
};