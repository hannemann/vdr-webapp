/**
 * @class
 * @constructor
 */
Gui.Osd.Controller.Default = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Osd.Controller.Default.prototype = new VDRest.Abstract.Controller();

/**
 * initialize view
 */
Gui.Osd.Controller.Default.prototype.init = function () {

    this.view = this.module.getView('Default', this.data);

    this.parentView = VDRest.app.getModule('Gui.Viewport').getView('Default');

    this.view.setParentView(this.parentView);

    this.dataModel = VDRest.app.getModule('VDRest.Osd').getModel('Osd');
    this.remote = VDRest.app.getModule('Gui.Remote');
};

/**
 * initialize view
 */
Gui.Osd.Controller.Default.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    this.addObserver();
    this.dataModel.loadOsd();
    this.remote.dispatch(this.parentView);
};

/**
 * add event listeners
 */
Gui.Osd.Controller.Default.prototype.addObserver = function () {

    $(document).on('osdloaded', $.proxy(this.refreshView, this));

    $(document).on('remotekeypress', $.proxy(this.dataModel.loadOsd, this.dataModel));
};

/**
 * remove event listeners
 */
Gui.Osd.Controller.Default.prototype.removeObserver = function () {

    $(document).off('osdloaded');

    $(document).off('remotekeypress');
};

/**
 * refresh osd
 * @param {jQuery.Event} e
 */
Gui.Osd.Controller.Default.prototype.refreshView = function (e) {

    this.data = this.view.data = e.payload.data;

    this.view.rePaint();
};

/**
 * destroy
 */
Gui.Osd.Controller.Default.prototype.destructView = function () {

    VDRest.app.getModule('Gui.Remote').destruct();

    VDRest.Abstract.Controller.prototype.destructView.call(this);
};
