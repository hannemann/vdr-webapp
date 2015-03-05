/**
 * @class
 * @constructor
 */
Gui.Database.Controller.List.Item.Actors = function () {
};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Database.Controller.List.Item.Actors.prototype = new Gui.Database.Controller.List.Item.Abstract();

/**
 * @type {boolean}
 */
Gui.Database.Controller.List.Item.Actors.prototype.type = 'Actors';

/**
 * add actors
 */
Gui.Database.Controller.List.Item.Actors.prototype.addActors = function () {

    var actors = this.getData('media').actors;

    actors.forEach(function (actor) {
        actor.parent = this;
        actor = this.module.getController('List.Item.Actors.Actor', actor);
        this.actors.push(actor);
        actor.dispatchView();
    }.bind(this));
};
