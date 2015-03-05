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
    this.clone.find('.ctrl-button.seasons').on('click', this.handleSeasons.bind(this));
};

Gui.Database.Controller.List.Show.prototype.handleSeasons = function () {

    console.log(this, 'handleSeasons');
};