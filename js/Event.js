Event = function (event) {

	this.event = event;
	return this;
};

Event.prototype.dispatchWindow = function () {

    var win = new Event.Window(this.event);

    win.dispatch();
};
