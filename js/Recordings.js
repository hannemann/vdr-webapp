Recordings = function () {};

Recordings.prototype = new GuiList();

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

    this.index = {};

    for (i;i<l;i++) {
        recordings[i] = new Recording(recordings[i]);
    }

    recordings = $(recordings).sort(this.sortByName);

    for (i=0;i<l;i++) {
        this.renderRecursive(recordings[i].paths(), this.index, this.itemList, recordings[i]);
    }
}

Recordings.prototype.sortByName = function (a, b){
    var aName = a.name().toLowerCase();
    var bName = b.name().toLowerCase();
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

main.registerModule('Recordings');