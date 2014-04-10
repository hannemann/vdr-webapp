/**
 * @class
 * @constructor
 */
Gui.Epg.Controller.TimeLine = function () {};

/**
 * @type {VDRest.Lib.Cache.store.Controller}
 */
Gui.Epg.Controller.TimeLine.prototype = new VDRest.Abstract.Controller();

/**
 * get start date object and initialize view
 */
Gui.Epg.Controller.TimeLine.prototype.dispatchView = function () {

    this.from = this.module.store[VDRest.config.getItem('lastEpg')];

    this.view = this.module.getView('TimeLine');

    this.view.setParentView(this.data.parent.view);

    this.module.getViewModel('TimeLine', {
        "view" : this.view,
        "from" : this.from
    });

    console.log(this.view);
};