Recording = function (options) {
    this.decodePaths = false;
    this.relative = true;
    this.element = $('<li>');
    GuiItem.call(this, options);
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

    var paths = this.get(this.relative ? 'relative_file_name' : 'file_name'),
        i = 0,
        l;

    paths = paths.replace(/_/g, ' ').split('/').slice(1, -2);

    l = paths.lengths

    if (this.decodePaths) {
        for (i;i<l;i++) {
            paths[i] = this.vdrDecodeURI(paths[i]);
        }
    }

    return paths;
};

/**
 * retrieve filename
 * @return {string}
 */
Recording.prototype.name = function () {

    var filename = this.get(this.relative ? 'relative_file_name' : 'file_name')
        .split('/').slice(-2, -1)[0].replace(/_/g, ' ');

    return this.decodePaths ? this.vdrDecodeURI(filename) : filename;
};

/**
 * render item
 * @param dom
 */
Recording.prototype.renderIn = function (dom) {

    if (!dom instanceof jQuery) {
        throw 'Argument dom is not of type jQuery in Timer.prototype.renderIn';
    }
    dom.append(this.dom().addClass(this.className).text(this.decodePaths ? this.vdrDecodeURI(this.name()) : this.name()));
};

/**
 * decode vdr style entity encoding
 * @param path
 * @return {*}
 */
Recording.prototype.vdrDecodeURI = function (path) {

    try {

        path = decodeURIComponent(encodeURIComponent(path).replace(/%23/g, '%'));

    } catch (e) {}

    return path.replace(/_/g, ' ');
}