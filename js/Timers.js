Timers = function () {};

Timers.prototype = new Gui.List();

Timers.prototype.optionName = "Timer";

Timers.prototype.name = "timers";

Timers.prototype.wrapperClass = "timers-wrapper";

Timers.prototype.urls = {
    "load":"timers.json"
};

Timers.prototype.onSuccess = function (result) {
    var  now = new Date(),
        timers = result.timers, timer,
        i = 0,
        l = timers.length;

    this.index = {};

    for (i;i<l;i++) {
        timer = new Timer(timers[i]);

//        console.log(timer.date(), timer.startDate(), timer.stopDate(), timer.paths(), timer.name(), timer.get('priority'));

        this.renderRecursive(timer.paths(), this.index, this.itemList, timer);
    }
}

main.registerModule('Timers');