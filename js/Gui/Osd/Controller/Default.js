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

    this.view.red    && this.view.red.on('click', $.proxy(this.sendKey, this, 'Red'));
    this.view.green  && this.view.green.on('click', $.proxy(this.sendKey, this, 'Green'));
    this.view.yellow && this.view.yellow.on('click', $.proxy(this.sendKey, this, 'Yellow'));
    this.view.blue   && this.view.blue.on('click', $.proxy(this.sendKey, this, 'Blue'));

    return this;
};

/**
 * remove event listeners
 */
Gui.Osd.Controller.Default.prototype.removeObserver = function () {

    $(document).off('osdloaded');

    $(document).off('remotekeypress');

    this.view.red    && this.view.red.off('click');
    this.view.green  && this.view.green.off('click');
    this.view.yellow && this.view.yellow.off('click');
    this.view.blue   && this.view.blue.off('click');

    return this;
};

/**
 * refresh osd
 * @param {jQuery.Event} e
 */
Gui.Osd.Controller.Default.prototype.refreshView = function (e) {

    this.data = this.view.data = e.payload.data;

    this.removeObserver();

    this.view.rePaint();

    this.addObserver();
};

/**
 * send key
 */
Gui.Osd.Controller.Default.prototype.sendKey = function (key) {

    this.vibrate();
    this.module.backend.send(key);
};

/**
 * destroy
 */
Gui.Osd.Controller.Default.prototype.destructView = function () {

    VDRest.app.getModule('Gui.Remote').destruct();

    VDRest.Abstract.Controller.prototype.destructView.call(this);
};
