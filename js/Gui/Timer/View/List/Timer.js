/**
 * @class
 * @constructor
 */
Gui.Timer.View.List.Timer = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Timer.View.List.Timer.prototype = new VDRest.Abstract.View();

/**
 * @type {string}
 */
Gui.Timer.View.List.Timer.prototype.cacheKey = 'id';

/**
 * initialize nodes
 */
Gui.Timer.View.List.Timer.prototype.init = function () {

    this.node = $('<div class="timer list-item clearer">');

    this.titleWrapper = $('<div class="clearer">').appendTo(this.node);

    this.date = $('<span class="date">').appendTo(this.titleWrapper);

    this.channel = $('<span class="channel">').appendTo(this.titleWrapper);

    this.time = $('<span class="time">').appendTo(this.titleWrapper);

    this.fileWrapper = $('<div>').appendTo(this.node);
};

/**
 * decorate and render
 */
Gui.Timer.View.List.Timer.prototype.render = function () {

    this.decorate();

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * decorate
 */
Gui.Timer.View.List.Timer.prototype.decorate = function () {

    this.channel.text(this.getChannelName());

    this.addPath().addFilename();

    this.date.text(this.addStartDate());

    this.time.text(this.addTime());

    this.addClasses()
        .addMenuButton();
};

/**
 * call decorator
 */
Gui.Timer.View.List.Timer.prototype.update = function () {

    this.decorate();
};

/**
 * retrieve start date as fancy string
 * @returns {string}
 */
Gui.Timer.View.List.Timer.prototype.addStartDate = function () {

    var date = this.getStartDate(), string = '';

    string += this.helper().getWeekDay(date, true) + '. ' + this.helper().getDateString(date, true);

    return string;
};

/**
 * retrieve time as string
 * @returns {string}
 */
Gui.Timer.View.List.Timer.prototype.addTime = function () {

    var start = this.getStartDate(), end = this.getEndDate(), string = '';

    string += this.helper().getTimeString(start) +' - '+ this.helper().getTimeString(end);

    return string;
};

/**
 * add path node
 */
Gui.Timer.View.List.Timer.prototype.addPath = function () {

    var path = this.getFilename().split('~').slice(0, -1);

    if (path.length > 0) {

        if (!this.path) {

            this.path = $('<div class="path">');

            if (this.filename) {

                this.path.insertBefore(this.filename);

            } else {
                this.path.appendTo(this.fileWrapper);
            }
        }

        this.path.text(path.join('/'));

    } else if (this.path) {

        this.path.remove();
        this.path = undefined;
    }

    return this;
};

/**
 * add filename node
 */
Gui.Timer.View.List.Timer.prototype.addFilename = function () {

    if (!this.filename) {

        this.filename = $('<div class="filename">').appendTo(this.fileWrapper);
    }

    this.filename.text(this.getFilename().split('~').pop());

    return this;
};

/**
 * add class names
 */
Gui.Timer.View.List.Timer.prototype.addClasses = function () {

    this.node.toggleClass('active', this.getIsActive());

    this.node.toggleClass('recording', this.getIsRecording());

    return this;
};

/**
 * add menu button
 */
Gui.Timer.View.List.Timer.prototype.addMenuButton = function () {

    this.menuButton = $('<div>').html('&vellip;').addClass('listitem-menu-button');
    this.menuButton.appendTo(this.node);

    return this;
};
