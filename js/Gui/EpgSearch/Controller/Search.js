/**
 * @class
 * @constructor
 */
Gui.EpgSearch.Controller.Search = function () {};

/**
 *
 * @type {VDRest.Abstract.Controller}
 */
Gui.EpgSearch.Controller.Search.prototype = new VDRest.Abstract.Controller();

/**
 * initialize list
 */
Gui.EpgSearch.Controller.Search.prototype.init = function () {

    this.broadcastList = [];

    this.view = this.module.getView('Search');

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );
};

/**
 * dispatch
 */
Gui.EpgSearch.Controller.Search.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * add event listeners
 */
Gui.EpgSearch.Controller.Search.prototype.addObserver = function () {

    $(document).on('epgsearchcomplete', this.initResults.bind(this));
};

/**
 * remove event listeners
 */
Gui.EpgSearch.Controller.Search.prototype.removeObserver = function () {

    $(document).off('epgsearchcomplete');
};

/**
 * iterate resultCollection, dispatch results
 * @param resultCollection
 */
Gui.EpgSearch.Controller.Search.prototype.initResults = function (resultCollection) {

    var i = 0, l = this.broadcastList.length;

    for (i;i<l;i++) {

        this.broadcastList[i].destructView();
    }

    resultCollection.iterate(function (dataModel) {

        this.broadcastList.push(this.module.getController('Broadcast', {
            'channel' : dataModel.data.channel,
            'id' : dataModel.data.id,
            "parent" : this,
            "dataModel" : dataModel
        }));

        this.broadcastList[this.broadcastList.length - 1].dispatchView();
    }.bind(this));
};

/**
 * destruct view
 */
Gui.EpgSearch.Controller.Search.prototype.destructView = function () {

    var i = 0, l = this.broadcastList.length;

    VDRest.Abstract.Controller.prototype.destructView.call(this);

    for (i;i<l;i++) {

        this.broadcastList[i].destructView();
    }

    $.event.trigger({
        "type" : "destruct.form-Search"
    });
};