/**
 * @class
 * @constructor
 */
Gui.Recordings.Controller.List = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Recordings.Controller.List.prototype = new VDRest.Abstract.Controller();

/**
 * retrieve List items
 */
Gui.Recordings.Controller.List.prototype.init = function () {

    this.view = this.module.getView('List');

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );

    this.recordingsList = VDRest.Lib.Object.prototype.getInstance();

    this.dataModel = VDRest.app.getModule('VDRest.Recordings').getModel('List');
};

/**
 * dispatch views, init event handling
 */
Gui.Recordings.Controller.List.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();

    if (this.dataModel.getCollection().length > 0) {

        this.iterateRecordings({
            "iterate" : $.proxy(this.dataModel.collectionIterator, this.dataModel),
            "collection" : this.dataModel.getCollection()
        });
    } else {

        this.dataModel.initList();
    }

    $.event.trigger('recordingslist.dispatched');
};

/**
 * iterate data model collection
 * @param {object} collection
 */
Gui.Recordings.Controller.List.prototype.iterateRecordings = function (collection) {

    collection.iterate($.proxy(function (recordingsModel) {

        this.recordingsList.setData(

            recordingsModel.data.number,

            recordingsModel.data.name

//            this.module.getController('List.Recording', {
//                "number" : recordingsModel.data.number,
//                "parent" : this,
//                "dataModel" : recordingsModel
//            })
        );

    }, this));

    this.dispatchList();
};

Gui.Recordings.Controller.List.prototype.dispatchList = function () {

    this.module.getViewModel('List', {
        "view" : this.view,
        "resource" : this.recordingsList
    });

    this.view.renderFirstLevel();

//    this.recordingsList.each(function () {
//
//        arguments[1].dispatchView();
//    });
};

Gui.Recordings.Controller.List.prototype.addObserver = function () {

    $(document).one('recordingsloaded', $.proxy(this.iterateRecordings, this));
};

Gui.Recordings.Controller.List.prototype.removeObserver = function () {};

Gui.Recordings.Controller.List.prototype.destructView = function () {

    this.recordingsList.each(function () {

        arguments[1].destructView();
    });

    VDRest.Abstract.Controller.prototype.destructView.call(this);
};