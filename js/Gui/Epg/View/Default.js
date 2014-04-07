
Gui.Epg.View.Default = function () {};

Gui.Epg.View.Default.prototype = new VDRest.Abstract.View();

/**
 * Main EPG View
 * @var {jQuery} main
 * @var {jQuery} channels
 * @var {jQuery} broadcasts
 */
Gui.Epg.View.Default.prototype.init = function () {

    this.main = $('<div id="epg" class="clearer">');

    this.broadcasts = $('<div id="broadcasts">')
        .appendTo(
            $('<div id="broadcasts-wrapper">')
                .appendTo(this.main)
        );
};

Gui.Epg.View.Default.prototype.render = function () {

    return this.main.appendTo('#viewport');
};