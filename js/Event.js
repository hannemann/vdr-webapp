Event = function () {

//    Gui.List.Item.apply(this, arguments);
//	return this;
};

Event.prototype = new Gui.List.Item();

Event.prototype.dateReg = /([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/;

Event.prototype.dayReg = /([0-9]{4})-([0-9]{2})-([0-9]{2})/;

Event.prototype.windowWrapperClass = 'Epg';

/**
 * create and dispatch info window
 */
Event.prototype.dispatchWindow = function (event) {

    var win = Lib.factory.getClass(this.windowWrapperClass + '.' + 'Window', event);

    win.dispatch();
};

/**
 * retrieve date object of start timestamp
 * @return {Date}
 */
Event.prototype.startDate = function() {

    return helper.strToDate(this.getData('start_timestamp'), this.dateReg);
};

/**
 * retrieve date object of end timestamp
 * @return {Date}
 */
Event.prototype.stopDate = function() {

    return helper.strToDate(this.getData('stop_timestamp'), this.dateReg);
};

/**
 * retrieve date object of day
 * @return {Date}
 */
Event.prototype.date = function() {

    return helper.strToDate(this.getData('day'), this.dayReg);
};
