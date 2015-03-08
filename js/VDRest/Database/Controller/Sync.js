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
 * @param {Function} updategui
 * @param {Function} oncomplete
 */
VDRest.Database.Controller.Sync.prototype.synchronize = function (updategui, oncomplete) {

    this.syncModel = this.module.getModel('Sync');
    this.syncModel.updategui = updategui;
    this.syncModel.oncomplete = oncomplete;
    this.syncModel.synchronize();
};
