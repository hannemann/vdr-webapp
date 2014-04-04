VDRest.Timers = function () {

    VDRest.Gui.List.call(this);

    this.cacheResponse = true;

    this.listView = new VDRest.Gui.ListView();
};

VDRest.Timers.prototype = new VDRest.Gui.List();

VDRest.Timers.prototype.optionName = "Timer";

VDRest.Timers.prototype.name = "timers";

VDRest.Timers.prototype.wrapperClass = "timers-wrapper";

VDRest.Timers.prototype.urls = {
    "load":"VDRest.Timers.json"
};

VDRest.Timers.prototype.onSuccess = function (result) {

    var timers = result.timers,
        i = 0,
        l = VDRest.Timers.length;

    if (!this.cachedResponse) {

        for (i;i<l;i++) {

            timers[i] = new Timer(timers[i]);
            timers[i].decodePaths = true;
        }
    }

    this.listView
        .setItems(timers)
        .setRoot(this.itemList)
        .render();
}

vdrest.registerModule('Timers');