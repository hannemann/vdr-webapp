Gui.Video.View.Player.Controls.Quality.Abstract = function () {};

Gui.Video.View.Player.Controls.Quality.Abstract.prototype = new VDRest.Abstract.View();

/**
 * @type {boolean}
 */
Gui.Video.View.Player.Controls.Quality.Abstract.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Video.View.Player.Controls.Quality.Abstract.prototype.init = function () {

    this.player = this.data.player;

    this.node = $('<div class="select">').addClass(this.className + '-select');
    this.optionList = $('<div class="item-list">').addClass(this.className).appendTo(this.node);
};

/**
 * render
 */
Gui.Video.View.Player.Controls.Quality.Abstract.prototype.render = function () {

    this.addOptions();

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * add options
 */
Gui.Video.View.Player.Controls.Quality.Abstract.prototype.addOptions = function () {

    this.options.forEach(function (option) {
        this.getOption(option).appendTo(this.optionList)
    }.bind(this));
};

/**
 * add options
 */
Gui.Video.View.Player.Controls.Quality.Abstract.prototype.getOption = function (value) {

    var option = document.createElement('DIV');

    option.classList.add('item');
    if (this.selected(value)) {
        option.classList.add('selected');
    }

    return $(option).text(value);
};

/**
 * @param {string} value
 * @return {boolean}
 */
Gui.Video.View.Player.Controls.Quality.Abstract.prototype.selected = function (value) {

    return value == this.data.selected;
};

/**
 * expose selected value
 */
Gui.Video.View.Player.Controls.Quality.Abstract.prototype.scrollToSelected = function () {

    this.optionList.css({
        "top": - this.optionList.find('.item.selected').position().top + 'px'
    });
};

/**
 * add options
 */
Gui.Video.View.Player.Controls.Quality.Abstract.prototype.toggleActiveState = function () {

    this.node.toggleClass('active');
};
