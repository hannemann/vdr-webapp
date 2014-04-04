VDRest.Event = function () {

//    Gui.List.Item.apply(this, arguments);
//	return this;
};

VDRest.Event.prototype = new VDRest.Gui.List.Item();

VDRest.Event.prototype.dateReg = /([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/;

VDRest.Event.prototype.dayReg = /([0-9]{4})-([0-9]{2})-([0-9]{2})/;

VDRest.Event.prototype.windowWrapperClass = 'Epg';

/**
 * create and dispatch info window
 */
VDRest.Event.prototype.dispatchWindow = function (event) {

    var win = Lib.factory.getClass(this.windowWrapperClass + '.' + 'Window', event);

    win.dispatch();
};

/**
 * retrieve date object of start timestamp
 * @return {Date}
 */
VDRest.Event.prototype.startDate = function() {

    return helper.strToDate(this.getData('start_timestamp'), this.dateReg);
};

/**
 * retrieve date object of end timestamp
 * @return {Date}
 */
VDRest.Event.prototype.stopDate = function() {

    return helper.strToDate(this.getData('stop_timestamp'), this.dateReg);
};

/**
 * retrieve date object of day
 * @return {Date}
 */
VDRest.Event.prototype.date = function() {

    return helper.strToDate(this.getData('day'), this.dayReg);
};
