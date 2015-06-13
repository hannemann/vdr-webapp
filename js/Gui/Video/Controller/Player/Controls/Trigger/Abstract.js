Gui.Video.Controller.Player.Controls.Trigger = function () {};

/**
 * @constructor
 */
Gui.Video.Controller.Player.Controls.Trigger.Abstract = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Video.Controller.Player.Controls.Trigger.Abstract.prototype = new VDRest.Abstract.Controller();

/**
 * @type {boolean}
 */
Gui.Video.Controller.Player.Controls.Trigger.Abstract.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Video.Controller.Player.Controls.Trigger.Abstract.prototype.init = function () {

    this.view = this.module.getView('Player.Controls.Trigger.' + this.type, {
        "parent" : this.data.parent
    });

    this.view.setParentView(this.data.parent);
};

/**
 * dispatch view
 */
Gui.Video.Controller.Player.Controls.Trigger.Abstract.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    this.addObserver();
};

/**
 * add event listeners
 */
Gui.Video.Controller.Player.Controls.Trigger.Abstract.prototype.addObserver = function () {

    this.observer = this.handler.bind(this);

    this.view.node.on(VDRest.helper.pointerStart, this.observer);
};

/**
 * remove event listeners
 */
Gui.Video.Controller.Player.Controls.Trigger.Abstract.prototype.removeObserver = function () {

    this.view.node.off(VDRest.helper.pointerStart, this.observer);
};

/**
 * callback
 * @param {jQuery.Event} e
 */
Gui.Video.Controller.Player.Controls.Trigger.Abstract.prototype.handler = function (e) {

    this.data.handler(e);
    this.view.toggleState();
};

/**
 * destruct
 */
Gui.Video.Controller.Player.Controls.Trigger.Abstract.prototype.destructView = function () {

    VDRest.Abstract.Controller.prototype.destructView.call(this);
    delete this.view;
    delete this.data;
};
