/**
 * @class
 * @constructor
 */
Gui.Database.Controller.List.Item.Actors = function () {
};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Database.Controller.List.Item.Actors.prototype = new VDRest.Abstract.Controller();

/**
 * @type {boolean}
 */
Gui.Database.Controller.List.Item.Actors.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Database.Controller.List.Item.Actors.prototype.init = function () {

    this.view = this.module.getView('List.Item.Actors', this.data);

    this.view.setParentView(this.data.parent.view);

    this.actors = [];
};

Gui.Database.Controller.List.Item.Actors.prototype.dispatchView = function () {

    this.addActors();

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
};

Gui.Database.Controller.List.Item.Actors.prototype.addActors = function () {

    var actors = this.getData('media').actors;

    actors.forEach(function (actor) {
        actor.parent = this;
        actor = this.module.getController('List.Item.Actors.Actor', actor);
        this.actors.push(actor);
        actor.dispatchView();
    }.bind(this));
};
