VDRest.Recordings = function () {

    VDRest.Gui.List.call(this);

    this.cacheResponse = true;

    this.treeView = new VDRest.Gui.TreeView();
};

VDRest.Recordings.prototype = new VDRest.Gui.List();

VDRest.Recordings.constructor = VDRest.Recordings;

VDRest.Recordings.prototype.optionName = "Aufnahmen";

VDRest.Recordings.prototype.name = "recordings";

VDRest.Recordings.prototype.wrapperClass = "recordings-wrapper";

VDRest.Recordings.prototype.urls = {

    "load":"recordings/.json"
};

VDRest.Recordings.prototype.onSuccess = function (result) {

    var recordings = result.recordings,
        i = 0,
        l = VDRest.Recordings.length;

    if (!this.cachedResponse) {

        for (i;i<l;i++) {

            recordings[i] = new Recording(recordings[i]);
            recordings[i].decodePaths = true;
        }
    }

    this.treeView
        .setItems(recordings)
        .setRoot(this.itemList)
        .render();
};

VDRest.app.registerModule('Recordings');