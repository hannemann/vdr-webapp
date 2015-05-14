/**
 * @class
 * @constructor
 */
Gui.SearchTimer.Controller.Search = function () {
};

/**
 *
 * @type {VDRest.Abstract.Controller}
 */
Gui.SearchTimer.Controller.Search.prototype = new VDRest.Abstract.Controller();

/**
 * initialize list
 */
Gui.SearchTimer.Controller.Search.prototype.init = function () {

    this.broadcastList = [];

    this.eventPrefix = 'SearchTimerTest';

    this.view = this.module.getView('Search');

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );
};

/**
 * iterate resultCollection, dispatch results
 * @param resultCollection
 */
Gui.SearchTimer.Controller.Search.prototype.initResults = function (resultCollection) {

    var i = 0, l = this.broadcastList.length;

    for (i; i < l; i++) {

        this.broadcastList[i].destructView();
    }

    this.broadcastList = [];

    resultCollection.iterate(function (dataModel) {

        this.broadcastList.push(this.module.getController('Broadcast', {
            'channel': dataModel.data.channel,
            'id': dataModel.data.id,
            "parent": this,
            "dataModel": dataModel
        }));

        this.broadcastList[this.broadcastList.length - 1].dispatchView();
    }.bind(this));
};

/**
 * destruct view
 */
Gui.SearchTimer.Controller.Search.prototype.destructView = function () {

    var i = 0, l = this.broadcastList.length;
    this.module.cache.flushByClassKey(this);
    VDRest.Abstract.Controller.prototype.destructView.call(this);

    for (i; i < l; i++) {

        this.broadcastList[i].destructView();
    }
};