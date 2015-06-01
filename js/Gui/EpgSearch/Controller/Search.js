/**
 * @class
 * @constructor
 */
Gui.EpgSearch.Controller.Search = function () {};

/**
 * @type {Gui.Epg.Controller.Broadcasts}
 */
Gui.EpgSearch.Controller.Search.prototype = new Gui.Epg.Controller.Broadcasts();

/**
 * @type {string}
 */
Gui.EpgSearch.Controller.Search.prototype.itemController = 'Broadcast';

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
Gui.EpgSearch.Controller.Search.prototype.removeObserver = function () {

    $document.off('epgsearchcomplete');

    this.view.node[0].removeEventListener(VDRest.helper.pointerStart, this.pointerStartHandler);
    this.view.node[0].removeEventListener(VDRest.helper.pointerMove, this.pointerMoveHandler);
    this.view.node[0].removeEventListener(VDRest.helper.pointerEnd, this.pointerEndHandler);
};


/**
 * handle mouseup
 * @param {jQuery.Event} e
 */
Gui.EpgSearch.Controller.Search.prototype.handleUp = function (e) {

    if (!(e.target instanceof HTMLInputElement)) {
        Gui.Epg.Controller.Broadcasts.prototype.handleUp.call(this, e);
    }
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

    this.broadcastList = [];

    resultCollection.iterate(function (dataModel) {

        this.broadcastList.push(this.module.getController(this.itemController, {
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

    this.view.node.one(this.animationEndEvents, function () {

        var i = 0, l = this.broadcastList.length;

        VDRest.Abstract.Controller.prototype.destructView.call(this);

        for (i;i<l;i++) {

            this.broadcastList[i].destructView();
        }

        $.event.trigger({
            "type" : "destruct.form-Search"
        });
    }.bind(this));

    this.view.node.toggleClass('collapse expand');
};