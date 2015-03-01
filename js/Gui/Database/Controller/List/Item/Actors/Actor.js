/**
 * @class
 * @constructor
 */
Gui.Database.Controller.List.Item.Actors.Actor = function () {
};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Database.Controller.List.Item.Actors.Actor.prototype = new VDRest.Abstract.Controller();

/**
 * @type {boolean}
 */
Gui.Database.Controller.List.Item.Actors.Actor.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Database.Controller.List.Item.Actors.Actor.prototype.init = function () {

    this.view = this.module.getView('List.Item.Actors.Actor', this.data);

    this.view.setParentView(this.data.parent.view);
};

Gui.Database.Controller.List.Item.Actors.Actor.prototype.dispatchView = function () {

    this.addObserver();

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
};

Gui.Database.Controller.List.Item.Actors.Actor.prototype.addObserver = function () {

    this.view.node.on('click', this.handleClick.bind(this));
};

Gui.Database.Controller.List.Item.Actors.Actor.prototype.removeObserver = function () {

    this.view.node.off('click');
};

Gui.Database.Controller.List.Item.Actors.Actor.prototype.handleClick = function () {

    this.vibrate();

    this.clone = this.view.node.clone();

    VDRest.app.saveHistoryState('historychanged', this.removeClone.bind(this), 'actor');

    this.clone.addClass('fullscreen').appendTo('body');

    setTimeout(function () {
        this.clone.addClass('show');
    }.bind(this), 20);
};

Gui.Database.Controller.List.Item.Actors.Actor.prototype.removeClone = function () {

    this.clone.on(this.transitionEndEvent, function () {
        this.clone.remove();
    }.bind(this));
    this.clone.removeClass('show');
};
