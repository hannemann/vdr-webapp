/**
 * @class
 * @constructor
 */
Gui.Database.Controller.List.Movie = function () {
};

/**
 * @type {Gui.Database.Controller.List.Item}
 */
Gui.Database.Controller.List.Movie.prototype = new Gui.Database.Controller.List.Item();

/**
 * add event listeners
 */
Gui.Database.Controller.List.Movie.prototype.addObserver = function () {

    this.view.node.on('click', this.handleClick.bind(this));
};

/**
 * remove event listeners
 */
Gui.Database.Controller.List.Movie.prototype.removeObserver = function () {

    this.view.node.off('click');
};

/**
 * handle click event
 */
Gui.Database.Controller.List.Movie.prototype.handleClick = function () {

    VDRest.app.addDestroyer('hashChanged', this.removeItem.bind(this));
    VDRest.app.observe();
    VDRest.app.setLocationHash('DatabaseList~DisplayItem');
    this.displayItem();
};

/**
 * toggle display of single item on
 * @returns {Gui.Database.Controller.List.Movie}
 */
Gui.Database.Controller.List.Movie.prototype.displayItem = function () {

    this.clone = this.view.node.clone();

    this.clone.toggleClass('database-collection movies display-item hidden list-item');
    this.clone.appendTo('body');
    setTimeout(function () {
        this.clone.toggleClass('hidden show');
    }.bind(this), 20);

    return this;
};

/**
 * toggle display of single item off
 * @returns {Gui.Database.Controller.List.Movie}
 */
Gui.Database.Controller.List.Movie.prototype.removeItem = function () {

    this.clone.toggleClass('hidden show');
    this.clone.one(VDRest.Abstract.Controller.prototype.transitionEndEvents, function () {
        this.clone.remove();
    }.bind(this));

    return this;
};