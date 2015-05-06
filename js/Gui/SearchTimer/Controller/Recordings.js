/**
 * @class
 * @constructor
 */
Gui.SearchTimer.Controller.Recordings = function () {
};

/**
 *
 * @type {VDRest.Abstract.Controller}
 */
Gui.SearchTimer.Controller.Recordings.prototype = new VDRest.Abstract.Controller();

/**
 * initialize list
 */
Gui.SearchTimer.Controller.Recordings.prototype.init = function () {

    this.recordingsList = [];

    this.eventPrefix = 'SearchTimerRecordings';

    this.view = this.module.getView('Recordings');

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );
};

/**
 * iterate resultCollection, dispatch results
 * @param resultCollection
 */
Gui.SearchTimer.Controller.Recordings.prototype.initResults = function (resultCollection) {

    var i = 0, l = this.recordingsList.length;

    for (i; i < l; i++) {

        this.recordingsList[i].destructView();
    }

    this.recordingsList = [];

    resultCollection.iterate(function (dataModel) {

        if (dataModel.getRecordedBySearchTimer(resultCollection.sid)) {

            this.recordingsList.push(this.module.getController('Recording', {
                'file_name': dataModel.data.file_name,
                "parent": this,
                "dataModel": dataModel
            }));

            this.recordingsList[this.recordingsList.length - 1].dispatchView();
        }
    }.bind(this));
};

/**
 * destruct view
 */
Gui.SearchTimer.Controller.Recordings.prototype.destructView = function () {

    var i = 0, l = this.recordingsList.length;
    this.module.cache.flushByClassKey(this);
    VDRest.Abstract.Controller.prototype.destructView.call(this);

    for (i; i < l; i++) {

        this.recordingsList[i].destructView();
    }
};