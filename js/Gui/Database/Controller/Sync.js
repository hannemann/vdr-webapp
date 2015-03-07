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
        .one('window.confirm.confirm', this.doDispatch.bind(this))
        .one('window.confirm.cancel', this.goBack.bind(this));


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

Gui.Database.Controller.Sync.prototype.doDispatch = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    this.view.node.one(this.animationEndEvent, function () {
        VDRest.app.getModule('VDRest.Database').getController('Sync').synchronize(this.update.bind(this));
    }.bind(this));
};

Gui.Database.Controller.Sync.prototype.update = function (data) {

    if (data) {

        if ('addStep' === data.action) {
            this.currentStep = this.view.addStep(data);
        }
        if ('addMessage' === data.action) {
            if (data.message) {
                this.currentStep.message.html(data.message);
            }
            if (data.percentage) {
                this.currentStep.progressBar.css({"width": data.percentage + '%'});
            }
        }
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
    // apply animation
    this.view.node.toggleClass('collapse expand');
};
