
Gui.Epg.View.Broadcasts = function () {};

Gui.Epg.View.Broadcasts.prototype = new VDRest.Abstract.View();

/**
 * Main EPG View
 * @var {jQuery} wrapper
 * @var {jQuery} node
 */
Gui.Epg.View.Broadcasts.prototype.init = function () {

    this.wrapper = $('<div id="broadcasts-wrapper">');
    this.node = $('<div id="broadcasts">')
        .appendTo(this.wrapper);
};

/**
 * append node to parentNode
 */
Gui.Epg.View.Broadcasts.prototype.render = function () {

    this.wrapper.appendTo(this.parentView.node);
};