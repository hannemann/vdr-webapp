/**
 * @class
 * @constructor
 */
Gui.Database.Controller.List.Show = function () {
};

/**
 * @type {Gui.Database.Controller.List.Item}
 */
Gui.Database.Controller.List.Show.prototype = new Gui.Database.Controller.List.Item();

/**
 * add observers to clone
 */
Gui.Database.Controller.List.Show.prototype.addCloneObserver = function () {

    Gui.Database.Controller.List.Item.prototype.addCloneObserver.call(this);
    this.clone.find('.ctrl-button.seasons').on('click', this.handleArea.bind(this, 'seasons'));
};

/**
 * remove observers from clone
 */
Gui.Database.Controller.List.Show.prototype.removeCloneObserver = function () {

    Gui.Database.Controller.List.Item.prototype.removeCloneObserver.call(this);
    this.clone.find('.ctrl-button.seasons').off('click');
};


/**
 * handle info event
 * @param {String} area
 * @param {jQuery.Event} e
 */
Gui.Database.Controller.List.Show.prototype.handleArea = function (area, e) {

    if ($(e.target).hasClass('disabled')) return;

    if ('seasons' === area && !this.seasons) {
        this.addSeasons();
    }
    Gui.Database.Controller.List.Item.prototype.handleArea.call(this, area, e);
};

/**
 * add seasons area
 */
Gui.Database.Controller.List.Show.prototype.addSeasons = function () {

    this.seasons = this.module.getController('List.Item.Seasons', {
        "parent": {
            "view": {
                "node": this.clone
            }
        },
        "media": this.getData('media')
    });

    this.clone.addClass('hidden-seasons');
    this.data.areas.push('seasons');
    this.seasons.dispatchView();
};

/**
 * toggle display of single item off
 * @returns {Gui.Database.Controller.List.Item}
 */
Gui.Database.Controller.List.Show.prototype.removeItem = function () {

    this.seasons && this.seasons.destructView();
    delete this.seasons;

    Gui.Database.Controller.List.Item.prototype.removeItem.call(this);

    return this;
};