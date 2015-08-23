/**
 * @class
 * @constructor
 */
Gui.EpgSearch.View.Broadcasts = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.EpgSearch.View.Broadcasts.prototype = new VDRest.Abstract.View();

/**
 * render
 */
Gui.EpgSearch.View.Broadcasts.prototype.init = function () {

    this.node = $('<div class="epg-search-broadcasts">');
    this.noResults = $('<div class="epg-search-no-results">')
        .text(VDRest.app.translate('The search returned no results.'));
};

Gui.EpgSearch.View.Broadcasts.prototype.showNoResults = function () {

    this.noResults.appendTo(this.node);
};

Gui.EpgSearch.View.Broadcasts.prototype.hideNoResults = function () {

    this.noResults.remove();
};

Gui.EpgSearch.View.Broadcasts.prototype.header = function (hits) {

    this.headLine = $('<div class="epg-search-results-header">')
        .text(VDRest.app.translate('%d events found.', hits))
        .appendTo(this.node)
    ;
};

Gui.EpgSearch.View.Broadcasts.prototype.removeHeader = function () {

    if ("undefined" !== typeof this.headLine) {
        this.headLine.remove();
    }
};
