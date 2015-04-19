/**
 * Form Module
 * @constructor
 */
Gui.Form = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
Gui.Form.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
Gui.Form.prototype.namespace = 'Gui';

/**
 * Module name
 * @type {string}
 */
Gui.Form.prototype.name = 'Form';

/**
 * add render event
 */
Gui.Form.prototype.init = function () {

    var me = this;

    VDRest.Abstract.Module.prototype.init.call(this);

    $document.on('form.request', function (e) {

        me.dispatch(e.config);
    });
};

/**
 * dispatch requested type
 */
Gui.Form.prototype.dispatch = function (config) {

    this.getController('Abstract', config).dispatchView();
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Form', true);