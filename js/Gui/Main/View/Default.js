/**
 * @class
 * @constructor
 */
Gui.Main.View.Default = function () {
};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Main.View.Default.prototype = new VDRest.Abstract.View();

/**
 * init nodes
 */
Gui.Main.View.Default.prototype.init = function () {

    this.node = $('body');
    this.blocker = $('<div>').addClass('gui-blocker');
};

/**
 * render
 */
Gui.Main.View.Default.prototype.render = function () {

    this.blocker.appendTo(this.node);
};

/**
 * block gui with overlay
 * @param {boolean} block
 */
Gui.Main.View.Default.prototype.toggleBlocker = function (block) {

    if (block === true || "undefined" === typeof block) {
        this.blocker.addClass('blocking');
    } else {
        this.blocker.removeClass('blocking');
    }
};