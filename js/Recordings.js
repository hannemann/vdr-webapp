Recordings = function () {

    GuiList.call(this);

    this.cacheResponse = true;

    this.treeView = new GuiTreeView();
};

Recordings.prototype = new GuiList();

Recordings.constructor = Recordings;

Recordings.prototype.optionName = "Aufnahmen";

Recordings.prototype.name = "recordings";

Recordings.prototype.wrapperClass = "recordings-wrapper";

Recordings.prototype.urls = {

    "load":"recordings/.json"
};

Recordings.prototype.onSuccess = function (result) {

    var recordings = result.recordings,
        i = 0,
        l = recordings.length;

    if (!this.cachedResponse) {

        for (i;i<l;i++) {

            recordings[i] = new Recording(recordings[i]);
            recordings[i].decodePaths = true;
        }
    }

    this.treeView
        .setItems(recordings)
        .setParentNode(this.itemList)
        .render();
};

main.registerModule('Recordings');