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

    this.dataModel = VDRest.app.getModule('VDRest.SearchTimer').getModel('List.SearchTimer', {
        "id" : this.data.id
    });

    this.module.getViewModel('List.SearchTimer', {
        "id" : this.data.id,
        "view" : this.view,
        "resource" : this.dataModel.data
    });
};

/**
 * dispatch view, init event handling
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.isMuted = true;

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
    } else {
        this.view.node
            .on('mouseup', this.handleUp.bind(this))
            .on('mousedown', this.handleDown.bind(this))
        ;
    }

    $(document).on('gui-searchtimer.updated.' + this.keyInCache + '.' + this.eventNameSpace, this.update.bind(this));
};

/**
 * remove event listeners
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.removeObserver = function () {

    this.view.node.off('click touchend touchstart touchmove mouseup mousedown');

    $(document).off('gui-searchtimer.' + this.keyInCache + '.' + this.eventNameSpace);
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
        }
    }.bind(this), 500);
};

/**
 * update data, cache, view
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.update = function (e) {

    var timer = e.payload, cache = this.module.cache.store;

    this.data.id = timer.keyInCache;
    this.view.data.id = timer.keyInCache;

    delete cache.Controller['List.SearchTimer'][this.keyInCache];
    delete cache.View['List.SearchTimer'][this.keyInCache];
    delete cache.ViewModel['List.SearchTimer'][this.keyInCache];

    this.keyInCache = timer.keyInCache;
    cache.Controller['List.SearchTimer'][this.keyInCache] = this;

    this.view.keyInCache = timer.keyInCache;
    cache.View['List.SearchTimer'][this.keyInCache] = this.view;

    this.module.getViewModel('List.SearchTimer', {
        "id" : this.data.id,
        "view" : this.view,
        "resource" : this.dataModel.data
    });

    this.removeObserver();
    this.addObserver();

    this.view.update();
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
                "id" : this.dataModel.data.id,
                "resource": this.dataModel,
                "onsubmit": this.saveAction.bind(this)
            }
        }
    })
};

Gui.SearchTimer.Controller.List.SearchTimer.prototype.saveAction = function (fields) {

    this.dataModel.copyFromForm(fields).save();
};