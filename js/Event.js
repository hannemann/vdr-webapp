Event = function () {

    GuiListItem.apply(this, arguments);
	return this;
};

Event.prototype = new GuiListItem();

Event.prototype.dateReg = /([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/;

Event.prototype.dayReg = /([0-9]{4})-([0-9]{2})-([0-9]{2})/;

/**
 * create and dispatch info window
 */
Event.prototype.dispatchWindow = function () {

    var win = new Event.Window(this.getData());

    win.dispatch();
};

/**
 * retrieve date object of start timestamp
 * @return {Date}
 */
Event.prototype.startDate = function() {

    return helper.getDate(this.getData('start_timestamp'), this.dateReg);
};

/**
 * retrieve date object of end timestamp
 * @return {Date}
 */
Event.prototype.stopDate = function() {

    return helper.getDate(this.getData('stop_timestamp'), this.dateReg);
};

/**
 * retrieve date object of day
 * @return {Date}
 */
Event.prototype.date = function() {

    return helper.getDate(this.getData('day'), this.dayReg);
};
