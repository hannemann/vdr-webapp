/**
 * Timer Module
 * @constructor
 * @property {VDRest.SearchTimer.Model.Conflicts} conflicts
 */
Gui.Timer = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
Gui.Timer.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
Gui.Timer.prototype.namespace = 'Gui';

/**
 * Module name
 * @type {string}
 */
Gui.Timer.prototype.name = 'Timer';

/**
 * show up in drawer
 * @type {string}
 */
Gui.Timer.prototype.inDrawer = true;

/**
 * start page capable
 * @type {string}
 */
Gui.Timer.prototype.startPage = true;

/**
 * headline in menu bar
 * @type {string}
 */
Gui.Timer.prototype.headline = 'Timer';

/**
 * @type {[]}
 */
Gui.Timer.prototype.conflictsCollection = [];

/**
 * @type {number}
 */
Gui.Timer.prototype.conflictCheckInterval = 1000 * 60 * 30;

/**
 * @type {number}
 */
Gui.Timer.prototype.lastConflictCheck = 0;

/**
 * context menu definition
 * @type {{}}
 */
Gui.Timer.prototype.contextMenu = {

    "Refresh": {
        "labels": {
            "on": VDRest.app.translate("Refresh")
        },
        "state": "on",
        "scope": 'Gui.Timer',
        "fn": function () {

            this.refresh();
        }
    }
};

/**
 * initialize
 */
Gui.Timer.prototype.initLate = function () {

    $document.one('dispatch.after', function () {
        if (VDRest.info.hasPlugin('conflictcheckonly')) {

            this.initConflictsCheck()
                .checkConflicts();
        }
    }.bind(this));
};

/**
 * dispatch default view
 */
Gui.Timer.prototype.dispatch = function () {

    this.store = this.getStore();
    this.getController('List').dispatchView();
};

Gui.Timer.prototype.getStore = function () {

    if (!this.store) {
        this.store = VDRest.app.getModule('VDRest.Timer');
    }
    return this.store;
};

/**
 * initialize conflicts check
 * @return {Gui.Timer}
 */
Gui.Timer.prototype.initConflictsCheck = function () {

    var menubar = VDRest.app.getModule('Gui.Menubar').getController('Default');

    this.conflicts = VDRest.app.getModule('VDRest.SearchTimer').getModel('Conflicts');
    $window.on(this.conflicts.events.collectionloaded, this.handleConflicts.bind(this));

    setInterval(this.checkConflicts.bind(this), this.conflictCheckInterval);

    $document.on('visibilitychange', function () {

        if (VDRest.helper.isVisible() && Date.now() - this.lastConflictCheck > this.conflictCheckInterval) {

            this.checkConflicts()

        } else if (VDRest.helper.isVisible() && this.conflictsCollection.length > 0) {

            menubar.setHasProblem(true);

        } else if (!VDRest.helper.isVisible()) {

            menubar.setHasProblem(false);
        }
    }.bind(this));
    return this;
};

/**
 * check for timer conflicts
 * @return {Gui.Timer}
 */
Gui.Timer.prototype.checkConflicts = function () {

    if (VDRest.helper.isVisible() && VDRest.helper.hasConnection()) {
        this.conflicts.load();
        this.lastConflictCheck = Date.now();
    }
    return this;
};

/**
 * handle timer conflicts response
 * @param e
 */
Gui.Timer.prototype.handleConflicts = function (e) {

    /** @type Gui.Menubar.Controller.Default */
    var menubar = VDRest.app.getModule('Gui.Menubar').getController('Default');

    if (e.collection.length > 0) {
        menubar.setHasProblem(true);
        this.drawerCallback = function (button) {
            button.addClass('pulse-red');
            button.one('click', function () {
                menubar.setHasProblem(false);
                this.classList.remove('pulse-red');
            });
        }.bind(this);
        this.conflictsCollection = this.conflicts.getAllIds();

    } else {
        menubar.setHasProblem(false);
        this.drawerCallback = undefined;
        this.conflictsCollection = [];
    }
    if ([this.namespace, this.name].join('.') === VDRest.app.getCurrent()) {
        this.getController('List').applyConflicts();
    }
};

/**
 * dispatch default view
 */
Gui.Timer.prototype.destruct = function () {

    this.getController('List').destructView();
    this.cache.flush();
};

/**
 * refresh
 */
Gui.Timer.prototype.refresh = function () {

    this.flush().dispatch();
};

Gui.Timer.prototype.flush = function () {

    this.getController('List')
        .destroyTimers()
        .removeObserver()
        .timerList.initData();

    this.getStore().getModel('List').flushCollection();
    delete this.store.cache.store.Model['List.Timer'];
    delete this.cache.store.Controller['List.Timer'];
    delete this.cache.store.View['List.Timer'];
    delete this.cache.store.ViewModel['List.Timer'];

    return this;
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Timer', true);