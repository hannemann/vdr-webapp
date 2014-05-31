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

    if (this.isHidden) {

        this.isHidden = false;
        this.view.node.show();
    } else {

        if (this.dataModel.hasCollection) {

            this.iterateRecordings();
        } else {

            $(document).one(this.dataModel.events.collectionloaded, $.proxy(function () {

                this.iterateRecordings();
            }, this))
        }
    }

    $.event.trigger('recordingslist.dispatched');
};

/**
 * iterate data model collection
 */
Gui.Recordings.Controller.List.prototype.iterateRecordings = function () {

    this.dataModel.collectionIterator($.proxy(function (recordingsModel) {

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
 * add folder to tree
 */
Gui.Recordings.Controller.List.prototype.createFolderFromFile = function (file) {

    var viewModel = this.module.getViewModel('List');

    viewModel.current = file;

    viewModel.addToTree(viewModel.current.name, viewModel.tree);
};

/**
 * Destroy
 */
Gui.Recordings.Controller.List.prototype.destructView = function () {

    this.isHidden = true;
    this.view.node.hide();
};