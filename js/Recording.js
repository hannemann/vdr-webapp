Recording = function () {

    Event.apply(this, arguments);
    this.decodePaths = false;
    this.relative = true;
    this.element = $('<li>');
};

Recording.prototype = new Event();

Recording.prototype.className = 'recording-list-item collapsible collapsed';

/**
 * create and dispatch info window
 */
Recording.prototype.dispatchWindow = function () {

    var win = new Recording.Window(this.getData());

    win.dispatch();
};

/**
 * retrieve paths as array
 * @return {Array}
 */
Recording.prototype.pathNames = function () {

    var paths = this.getData(this.relative ? 'relative_file_name' : 'file_name'),
        i = 0,
        l;

    paths = paths.replace(/_/g, ' ').split('/').slice(1, -2);

    l = paths.lengths;

    if (this.decodePaths) {
        for (i;i<l;i++) {
            paths[i] = helper.vdrDecodeURI(paths[i]);
        }
    }

    return paths;
};

/**
 * retrieve filename
 * @return {string}
 */
Recording.prototype.name = function () {

    var filename = this.getData(this.relative ? 'relative_file_name' : 'file_name')
        .split('/').slice(-2, -1)[0].replace(/_/g, ' ');

    return this.decodePaths ? helper.vdrDecodeURI(filename) : filename;
};

/**
 * render item
 * @param dom
 */
Recording.prototype.renderIn = function (dom) {

    if (!dom instanceof jQuery) {
        throw 'Argument dom is not of type jQuery in Timer.prototype.renderIn';
    }
    this.addDomEvents();
    dom.append(this.dom().addClass(this.className).text(this.decodePaths ? helper.vdrDecodeURI(this.name()) : this.name()));
};

Recording.prototype.addDomEvents = function () {

    this.dom().on('click', $.proxy(function () {

        helper.log(this);
        this.dispatchWindow();

    }, this));
};
