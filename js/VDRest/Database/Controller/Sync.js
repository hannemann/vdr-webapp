/**
 * @class
 * @constructor
 */
VDRest.Database.Controller.Sync = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
VDRest.Database.Controller.Sync.prototype = new VDRest.Abstract.Controller();

/**
 * synchronize recordings
 */
VDRest.Database.Controller.Sync.prototype.synchronize = function () {

    var recordings = VDRest.app.getModule('VDRest.Recordings').getModel('List');

    this.syncModel = this.module.getModel('Sync');

    this.addObserver();

    VDRest.app.getModule('Gui.Menubar').getController('Default').showThrobber();
    recordings.initList();
};

/**
 * add event listeners
 */
VDRest.Database.Controller.Sync.prototype.addObserver = function () {

    $(document).one('recordingsloaded', $.proxy(this.syncModel.synchronize, this.syncModel));
};
