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

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );

    this.dataModel = VDRest.app.getModule('VDRest.Osd').getModel('Osd');
};

/**
 * initialize view
 */
Gui.Osd.Controller.Default.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    this.addObserver();
    this.dataModel.initOsd();

};

Gui.Osd.Controller.Default.prototype.addObserver = function () {

    $(document).on('osdloaded', $.proxy(this.refreshView, this));
};

Gui.Osd.Controller.Default.prototype.removeObserver = function () {

    $(document).on('osdloaded');
};

Gui.Osd.Controller.Default.prototype.refreshView = function (e) {

    this.data = this.view.data = e.payload.data;

    this.view.rePaint();
};
