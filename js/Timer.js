Timer = function (options) {
    this.element = $('<li>');
    this.constructor(options, this.element);
};

Timer.prototype = new GuiListItem();

Timer.prototype.dateReg = /([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/;

Timer.prototype.dayReg = /([0-9]{4})-([0-9]{2})-([0-9]{2})/;

Timer.prototype.className = 'list-item timer-list-item collapsible collapsed';

/**
 * retrieve date object of start timestamp
 * @return {Date}
 */
Timer.prototype.startDate = function() {
    return this.getDate(this.get('start_timestamp'), this.dateReg);
};

/**
 * retrieve date object of end timestamp
 * @return {Date}
 */
Timer.prototype.stopDate = function() {
    return this.getDate(this.get('stop_timestamp'), this.dateReg);
};

/**
 * retrieve date object of day
 * @return {Date}
 */
Timer.prototype.date = function() {
    return this.getDate(this.get('day'), this.dayReg);
};

/**
 * retrieve paths as array
 * @return {Array}
 */
Timer.prototype.paths = function () {
    return this.get('filename').split('~').slice(0, -1);
};

/**
 * retrieve filename
 * @return {string}
 */
Timer.prototype.name = function () {
    return this.get('filename').split('~').slice(-1)[0];
};

Timer.prototype.renderIn = function (dom) {
    if (!dom instanceof jQuery) {
        throw 'Argument dom is not of type jQuery in Timer.prototype.renderIn';
    }
    dom.append(this.dom().addClass(this.className).append('<div>'+this.name()+'</div>'));
};