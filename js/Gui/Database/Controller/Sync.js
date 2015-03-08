/**
 * @class
 * @constructor
 */
Gui.Database.Controller.Sync = function () {
};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Database.Controller.Sync.prototype = new VDRest.Abstract.Controller();

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Database.Controller.Sync.prototype.bypassCache = true;

/**
 * initialize view
 */
Gui.Database.Controller.Sync.prototype.init = function () {

    this.module.syncing = true;

    this.view = this.module.getView('Sync', this.data);

    VDRest.app.saveHistoryState('historychanged', this.destructView.bind(this), 'database-synchronize');

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );
};

/**
 * confirm and dispatch
 */
Gui.Database.Controller.Sync.prototype.dispatchView = function () {

    $(document)
        .one('window.confirm.confirm', this.synchronize.bind(this))
        .one('window.confirm.cancel', this.goBack.bind(this));

// TODO: confirm callbacks übergeben statt sich hier selbst darum zu kümmern...
    $.event.trigger({
        "type": "window.request",
        "payload": {
            "type": "Confirm",
            "data": {
                "message": VDRest.app.translate("This can take a long time. Proceed?"),
                "id": 'confirmsync'
            }
        }
    });
};

/**
 * dispatch view, get synchronizer, start process
 * @param {Function} complete
 */
Gui.Database.Controller.Sync.prototype.synchronize = function (complete) {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    this.view.node.one(this.animationEndEvent, function () {
        VDRest.app.getModule('VDRest.Database').getController('Sync').synchronize(this.update.bind(this), complete);
    }.bind(this));
};

/**
 * update gui
 * @param data
 */
Gui.Database.Controller.Sync.prototype.update = function (data) {

    if (data) {

        this.view.updateStep(data);
    }
};

/**
 * go back in history
 */
Gui.Database.Controller.Sync.prototype.goBack = function () {
    history.back();
};

/**
 * Destroy
 */
Gui.Database.Controller.Sync.prototype.destructView = function () {

    // remove on animation end
    this.view.node.one(this.animationEndEvent, function () {

        Gui.Window.Controller.Abstract.prototype.destructView.call(this);
        delete this.module.syncing;
    }.bind(this));

    delete this.module.syncing;
    
    // apply animation
    this.view.node.toggleClass('collapse expand');
};
