/**
 * @class
 * @constructor
 */
Gui.EpgSearch.Controller.Broadcast = function () {};

/**
 * @type {Gui.Epg.Controller.Broadcasts.List.Broadcast}
 */
Gui.EpgSearch.Controller.Broadcast.prototype = new Gui.Epg.Controller.Broadcasts.List.Broadcast();

/**
 * initialize view
 */
Gui.EpgSearch.Controller.Broadcast.prototype.init = function () {

    this.eventNameSpace = this.module.namespace + '-' + this.module.name;

    this.windowModule = VDRest.app.getModule('Gui.Epg');

    this.view = this.module.getView('Broadcast', {
        "id" : this.data.id,
        "channel" : this.data.channel
    });

    this.view.setParentView(this.data.parent.view);

    this.module.getViewModel('Broadcast', {
        "id" : this.data.id,
        "channel" : this.data.channel,
        "view" : this.view,
        "resource" : this.data.dataModel
    });

    this.view.decorate();
};