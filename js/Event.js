Event = function (event) {

	this.event = event;

    if (event.timer_exists && event.timer_active) {
        actions.loadTimer(this);
    }
	return this;
};

Event.prototype.dispatchWindow = function () {

    var win = new Event.Window(this.event);

    win.dispatch();
};
