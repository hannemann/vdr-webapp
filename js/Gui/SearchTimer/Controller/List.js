/**
 * @class
 * @constructor
 */
Gui.SearchTimer.Controller.List = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.SearchTimer.Controller.List.prototype = new VDRest.Abstract.Controller();

/**
 * init view and datamodel
 */
Gui.SearchTimer.Controller.List.prototype.init = function () {

    this.view = this.module.getView('List');

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );

    this.timerList = VDRest.Lib.Object.prototype.getInstance();

    this.dataModel = this.module.store.getModel('List');
};

/**
 * dispatch view, init event handling
 */
Gui.SearchTimer.Controller.List.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.preventReload()
        .addObserver();

    if (this.dataModel.getCollection().length > 0) {

        this.iterateTimers({
            "iterate": this.dataModel.collectionIterator.bind(this.dataModel),
            "collection" : this.dataModel.getCollection()
        });
    } else {

        this.module.store.initList();
    }

    $.event.trigger('searchtimerlist.dispatched');
};

/**
 * iterate data model collection
 * @param {object} collection
 */
Gui.SearchTimer.Controller.List.prototype.iterateTimers = function (collection) {

    collection.iterate(function (timerModel) {

        this.timerList.setData(

            timerModel.data.id,

            this.module.getController('List.SearchTimer', {
                "id" : timerModel.data.id,
                "parent" : this,
                "dataModel" : timerModel
            })
        );

    }.bind(this));

    this.dispatchList();
};

/**
 * dispatch timers
 */
Gui.SearchTimer.Controller.List.prototype.dispatchList = function () {

    this.timerList.each(function () {

        arguments[1].dispatchView();
    });
};

/**
 * dispatch timers
 */
Gui.SearchTimer.Controller.List.prototype.dispatchNew = function (e) {

    var id = e.payload.data.id,
        controller = this.module.getController('List.SearchTimer', {
            "id": e.payload.data.id,
            "parent": this,
            "dataModel": e.payload
        });

    this.timerList.setData(id, controller);
    controller.dispatchView();
};

/**
 * dispatch test result
 */
Gui.SearchTimer.Controller.List.prototype.dispatchSearchResult = function (e) {

    var controller = this.module.getController('Search', {"omitForm" : true});

    VDRest.app.pushHistoryState(
        this.module.name + '-' + controller.eventPrefix,
        controller.destructView.bind(controller)
    );

    controller.dispatchView();
    controller.broadcasts.initResults(e);
};

/**
 * dispatch test result
 */
Gui.SearchTimer.Controller.List.prototype.dispatchRecordings = function (e) {

    var controller = this.module.getController('Recordings');

    VDRest.app.pushHistoryState(
        this.module.name + '-' + controller.eventPrefix,
        controller.destructView.bind(controller)
    );

    controller.dispatchView();
    controller.initResults(e);
};

/**
 * add event listeners
 */
Gui.SearchTimer.Controller.List.prototype.addObserver = function () {

    $document.one('searchtimersloaded', this.iterateTimers.bind(this));
    $document.on('gui-searchtimer.created', this.dispatchNew.bind(this));
    $document.on('gui-searchtimer.deleted', this.deleteSearchTimer.bind(this));
    $document.on('gui-searchtimer.perform', this.dispatchSearchResult.bind(this));
};

/**
 * remove event listeners
 */
Gui.SearchTimer.Controller.List.prototype.removeObserver = function () {

    $document.off('searchtimersloaded', this.iterateTimers.bind(this));
    $document.off('gui-searchtimer.created');
    $document.off('gui-searchtimer.deleted');
    $document.off('gui-searchtimer.perform');
};

/**
 * delete search timer from list
 * @param e
 */
Gui.SearchTimer.Controller.List.prototype.deleteSearchTimer = function (e) {

    this.timerList.getData(e.payload).destructView();
    this.timerList.unsData(e.payload);
};

/**
 * destroy
 */
Gui.SearchTimer.Controller.List.prototype.destructView = function () {

    this.view.node.one(this.animationEndEvents, function () {

        this.timerList.each(function () {

            arguments[1].destructView();
        });

        VDRest.Abstract.Controller.prototype.destructView.call(this);
    }.bind(this));

    this.view.node.toggleClass('collapse expand');
};
