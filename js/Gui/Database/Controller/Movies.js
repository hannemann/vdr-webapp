/**
 * @class
 * @constructor
 */
Gui.Database.Controller.Movies = function () {
};

/**
 * @type {Gui.Database.Controller.List}
 */
Gui.Database.Controller.Movies.prototype = new Gui.Database.Controller.List();

/**
 * init view
 */
Gui.Database.Controller.Movies.prototype.init = function () {

    this.view = this.module.getView('Movies');

    //Gui.Database.Controller.List.prototype.init.call(this);

    this.getCollection('Movies');
};

/**
 * dispatch view
 * @param {Gui.Window.View.Abstract} parentView
 */
Gui.Database.Controller.Movies.prototype.dispatchView = function (parentView) {

    this.view.setParentView({
        "node": parentView.body
    });

    Gui.Database.Controller.List.prototype.dispatchView.call(this);

    this.collection.each(this.dispatchItem.bind(this));
};

/**
 * dispatch item
 * @param {VDRest.Database.Model.Movies.Movie} item
 */
Gui.Database.Controller.Movies.prototype.dispatchItem = function (item) {

    this.module.getController(
        'List.' + item._class.split('.')[1],
        {"parent": this, "media": item.data, "type": "Movie"}
    ).dispatchView();
};
