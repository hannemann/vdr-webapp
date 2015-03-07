/**
 * @class
 * @constructor
 */
VDRest.Database.Controller.Sync = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
VDRest.Database.Controller.Sync.prototype = new VDRest.Abstract.Controller();

VDRest.Database.Controller.Sync.prototype.bypassCache = true;

/**
 * synchronize recordings
 */
VDRest.Database.Controller.Sync.prototype.synchronize = function (callback) {

    this.syncModel = this.module.getModel('Sync');
    this.syncModel.callback = callback;
    //VDRest.app.getModule('Gui.Menubar').getController('Default').showThrobber();
    this.syncModel.synchronize();
};
