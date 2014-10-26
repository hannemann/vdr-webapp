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
    this.errors = 0;
};

/**
 * initialize view
 */
Gui.Osd.Controller.Default.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    this.addObserver();
    this.dataModel.loadOsd();
    this.remote.dispatch(this.parentView);
    this.startRefreshInterval();
};

/**
 * add event listeners
 */
Gui.Osd.Controller.Default.prototype.addObserver = function () {

    $(document).on('osdloaded', $.proxy(this.refreshView, this));

    $(document).on('remotekeypress', $.proxy(this.handleRemotePress, this));

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
 * start refresh interval
 */
Gui.Osd.Controller.Default.prototype.startRefreshInterval = function () {

    this.refreshInterval = setInterval(
        $.proxy(this.dataModel.loadOsd, this.dataModel),
        VDRest.config.getItem('osdLoadInterval')
    );
};

/**
 * stop refresh interval
 */
Gui.Osd.Controller.Default.prototype.stopRefreshInterval = function () {

    clearInterval(this.refreshInterval);
};

/**
 * load osd
 */
Gui.Osd.Controller.Default.prototype.loadOsd = function () {

    this.stopRefreshInterval();

    this.dataModel.loadOsd();

    this.startRefreshInterval();
};

/**
 * show message
 * @param {Boolean} state
 */
Gui.Osd.Controller.Default.prototype.showMessage = function (state) {

    this.view.messageBox.toggleClass('show', state);
};

/**
 * refresh osd
 * @param {jQuery.Event} e
 */
Gui.Osd.Controller.Default.prototype.refreshView = function (e) {

    this.data = this.view.data = e.payload.data;

    this.removeObserver();

    if (this.data.Error) {
        this.errors++ > 10 && history.back();
    } else {
        this.errors = 0;
    }

    this.view.rePaint();

    if (this.data.TextOsd && this.data.TextOsd.message && this.data.TextOsd.message !== '') {
        this.view.setMessage(this.data.TextOsd.message);
        if (!this.view.messageBox.hasClass('show')) {
            this.showMessage(true);
        }
    } else {
        this.view.setMessage('');
        if (this.view.messageBox.hasClass('show')) {
            this.showMessage(false);
        }
    }

    this.addObserver();
};

/**
 * handle remote press
 */
Gui.Osd.Controller.Default.prototype.handleRemotePress = function () {

    this.dataModel.loadOsd.call(this.dataModel);
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

    this.stopRefreshInterval();

    VDRest.app.getModule('Gui.Remote').destruct();

    VDRest.Abstract.Controller.prototype.destructView.call(this);
};
