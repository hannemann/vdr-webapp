Recording = function (options) {
    this.element = $('<div>');
    this.constructor(options, this.element);
};

Recording.prototype = new GuiListItem();

Recording.prototype.dateReg = /([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/;

Recording.prototype.dayReg = /([0-9]{4})-([0-9]{2})-([0-9]{2})/;

Recording.prototype.className = 'list-item recording-list-item collapsible collapsed';

/**
 * retrieve date object of start timestamp
 * @return {Date}
 */
Recording.prototype.startDate = function() {
    return this.getDate(this.get('start_timestamp'), this.dateReg);
};

/**
 * retrieve date object of end timestamp
 * @return {Date}
 */
Recording.prototype.stopDate = function() {
    return this.getDate(this.get('stop_timestamp'), this.dateReg);
};

/**
 * retrieve date object of day
 * @return {Date}
 */
Recording.prototype.date = function() {
    return this.getDate(this.get('day'), this.dayReg);
};

/**
 * retrieve paths as array
 * @return {Array}
 */
Recording.prototype.paths = function () {
    return this.get('file_name').replace(/_/g, ' ').split('/').slice(1, -2);
};

/**
 * retrieve filename
 * @return {string}
 */
Recording.prototype.name = function () {
    return this.get('file_name').split('/').slice(-2, -1)[0].replace(/_/g, ' ');
};

Recording.prototype.renderIn = function (dom) {
    if (!dom instanceof jQuery) {
        throw 'Argument dom is not of type jQuery in Timer.prototype.renderIn';
    }
    dom.append(this.dom().addClass(this.className).text(this.name()));
};