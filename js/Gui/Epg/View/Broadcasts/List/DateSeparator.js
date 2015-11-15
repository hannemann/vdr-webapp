/**
 * separate broadcasts by hour
 * @constructor
 * @property {{}} data
 * @property {Date} data.date
 * @property {number} data.timestamp
 * @property {number} data.position
 * @property {Gui.Epg.View.Broadcasts.List} parentView
 */
Gui.Epg.View.Broadcasts.List.DateSeparator = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Epg.View.Broadcasts.List.DateSeparator.prototype = new VDRest.Abstract.View();

/**
 * @type {string}
 */
Gui.Epg.View.Broadcasts.List.DateSeparator.prototype.cacheKey = 'timestamp/channel_id';

/**
 * initialize
 */
Gui.Epg.View.Broadcasts.List.DateSeparator.prototype.init = function () {

    this.node = $('<div>');
};

/**
 * render
 */
Gui.Epg.View.Broadcasts.List.DateSeparator.prototype.render = function () {

    this.addAttributes()
        .decorate();

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * add attributes
 * @return {Gui.Epg.View.Broadcasts.List.DateSeparator}
 */
Gui.Epg.View.Broadcasts.List.DateSeparator.prototype.addAttributes = function () {

    var node = this.node.get(0);

    node.classList.add('date-separator');
    node.dataset['pos'] = this.data.position;

    return this;
};

/**
 * decorate
 * @return {Gui.Epg.View.Broadcasts.List.DateSeparator}
 */
Gui.Epg.View.Broadcasts.List.DateSeparator.prototype.decorate = function () {

    this.node.text(
        this.data.date.format("epgDate")
    );

    return this;
};
