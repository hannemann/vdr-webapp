Timers = function () {

    Gui.List.call(this);

    this.cacheResponse = true;

    this.listView = new Gui.ListView();
};

Timers.prototype = new Gui.List();

Timers.prototype.optionName = "Timer";

Timers.prototype.name = "timers";

Timers.prototype.wrapperClass = "timers-wrapper";

Timers.prototype.urls = {
    "load":"timers.json"
};

Timers.prototype.onSuccess = function (result) {

    var timers = result.timers,
        i = 0,
        l = timers.length;

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

main.registerModule('Timers');