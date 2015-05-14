/**
 * @class
 * @constructor
 */
Gui.SearchTimer.Controller.Recording = function () {
};

/**
 * @type {Gui.Recordings.Controller.List.Recording}
 */
Gui.SearchTimer.Controller.Recording.prototype = new Gui.Recordings.Controller.List.Recording();

/**
 * initialize view
 */
Gui.SearchTimer.Controller.Recording.prototype.init = function () {

    if (!this.streamdevInfo) {
        Gui.Recordings.Controller.List.Recording.prototype.streamdevInfo = VDRest.app.getModule('VDRest.Info')
            .getModel('Info')
            .getPlugin('streamdev-server');
    }

    this.view = this.module.getView('Recording', {
        "file_name": this.data.file_name
    });

    this.view.setParentView(this.data.parent.view);

    this.dataModel = this.data.dataModel;

    this.module.getViewModel('Recording', {
        "file_name": this.data.file_name,
        "view": this.view,
        "resource": this.data.dataModel
    });
};

/**
 * destruct view
 */
Gui.SearchTimer.Controller.Recording.prototype.destructView = function () {

    this.module.cache.flushByClassKey(this);
    VDRest.Abstract.Controller.prototype.destructView.call(this);
};