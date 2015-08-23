/**
 * @class
 * @constructor
 */
Gui.EpgSearch.Controller.Broadcasts = function () {};

/**
 * @type {Gui.Epg.Controller.Broadcasts}
 */
Gui.EpgSearch.Controller.Broadcasts.prototype = new Gui.Epg.Controller.Broadcasts();

/**
 * @type {string}
 */
Gui.EpgSearch.Controller.Broadcasts.prototype.itemController = 'Broadcasts.Broadcast';

/**
 * initialize list
 */
Gui.EpgSearch.Controller.Broadcasts.prototype.init = function () {

    this.broadcastList = [];

    this.view = this.module.getView('Broadcasts');
};

/**
 * dispatch
 */
Gui.EpgSearch.Controller.Broadcasts.prototype.dispatchView = function () {

    this.view.setParentView(
        this.data.parent.view
    );

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * add event listeners
 */
Gui.EpgSearch.Controller.Broadcasts.prototype.addObserver = function () {

    $document.on('epgsearchcomplete', this.initResults.bind(this));

    this.pointerStartHandler = this.handleDown.bind(this);
    this.pointerMoveHandler = this.handleMove.bind(this);
    this.pointerEndHandler = this.handleUp.bind(this);
    this.view.node[0].addEventListener(VDRest.helper.pointerStart, this.pointerStartHandler);
    this.view.node[0].addEventListener(VDRest.helper.pointerMove, this.pointerMoveHandler);
    this.view.node[0].addEventListener(VDRest.helper.pointerEnd, this.pointerEndHandler);
};

/**
 * remove event listeners
 */
Gui.EpgSearch.Controller.Broadcasts.prototype.removeObserver = function () {

    $document.off('epgsearchcomplete');

    this.view.node[0].removeEventListener(VDRest.helper.pointerStart, this.pointerStartHandler);
    this.view.node[0].removeEventListener(VDRest.helper.pointerMove, this.pointerMoveHandler);
    this.view.node[0].removeEventListener(VDRest.helper.pointerEnd, this.pointerEndHandler);
};

/**
 * iterate resultCollection, dispatch results
 * @param resultCollection
 */
Gui.EpgSearch.Controller.Broadcasts.prototype.initResults = function (resultCollection) {

    var i = 0, l = this.broadcastList.length;

    this.view.hideNoResults();

    for (i;i<l;i++) {

        this.broadcastList[i].destructView();
    }

    this.view.removeHeader();

    this.broadcastList = [];

    if (resultCollection.collection.length > 0) {

        this.view.header(resultCollection.collection.length);

        resultCollection.iterate(function (dataModel) {

            this.broadcastList.push(this.module.getController(this.itemController, {
                'channel': dataModel.data.channel,
                'id': dataModel.data.id,
                "parent": this,
                "dataModel": dataModel
            }));

            this.broadcastList[this.broadcastList.length - 1].dispatchView();
        }.bind(this));
    } else {

        this.view.showNoResults();
    }
};

/**
 * destruct view
 */
Gui.EpgSearch.Controller.Broadcasts.prototype.destructView = function () {

    var i = 0,
        l = this.broadcastList.length;

    VDRest.Abstract.Controller.prototype.destructView.call(this);

    for (i;i<l;i++) {

        this.broadcastList[i].destructView();
    }
};