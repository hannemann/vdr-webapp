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

    this.dataModel = this.module.store.getModel('List');
};

/**
 * dispatch views, init event handling
 */
Gui.Recordings.Controller.List.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();

    if (this.isHidden) {

        this.isHidden = false;
        this.view.node.show();
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
        );

    }, this));

    this.dispatchList();
};

/**
 * dispatch first directory level
 */
Gui.Recordings.Controller.List.prototype.dispatchList = function () {

    this.module.getViewModel('List', {
        "view" : this.view,
        "resource" : this.recordingsList
    });

    this.view.renderFirstLevel();
};

/**
 * add event listeners
 */
Gui.Recordings.Controller.List.prototype.addObserver = function () {

    $(document).one('recordingsloaded', $.proxy(this.iterateRecordings, this));
};

/**
 * remove event listeners
 */
Gui.Recordings.Controller.List.prototype.removeObserver = function () {};

/**
 * Destroy
 */
Gui.Recordings.Controller.List.prototype.destructView = function () {

    this.isHidden = true;
    this.view.node.hide();
};