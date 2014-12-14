/**
 * @class
 * @constructor
 */
Gui.Database.Controller.List.Item = function () {
};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Database.Controller.List.Item.prototype = new VDRest.Abstract.Controller();

/**
 * @type {boolean}
 */
Gui.Database.Controller.List.Item.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Database.Controller.List.Item.prototype.init = function () {

    this.view = this.module.getView('List.' + this.data.type, this.data);

    this.view.setParentView(this.data.parent.view);
};

/**
 * dispatch view
 */
Gui.Database.Controller.List.Item.prototype.dispatchView = function () {

    //this.helper().log(this.data);

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * add event listeners
 */
Gui.Database.Controller.List.Item.prototype.addObserver = function () {

    this.view.node.on('click', this.handleClick.bind(this));
};

/**
 * remove event listeners
 */
Gui.Database.Controller.List.Item.prototype.removeObserver = function () {

    this.view.node.off('click');
};

/**
 * handle click event
 */
Gui.Database.Controller.List.Item.prototype.handleClick = function () {

    this.vibrate();
    VDRest.app.addDestroyer('hashChanged', this.removeItem.bind(this));
    VDRest.app.observe();
    VDRest.app.setLocationHash('DatabaseList~DisplayItem');
    this.displayItem();
};

/**
 * toggle display of single item on
 * @returns {Gui.Database.Controller.List.Movie}
 */
Gui.Database.Controller.List.Item.prototype.displayItem = function () {

    var typeClassName = this.data.type.toLowerCase() + 's';

    this.clone = this.view.node.clone();

    this.clone.toggleClass('database-collection display-item hidden list-item ' + typeClassName);
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
Gui.Database.Controller.List.Item.prototype.removeItem = function () {

    this.clone.toggleClass('hidden show');
    this.clone.one(VDRest.Abstract.Controller.prototype.transitionEndEvents, function () {
        this.clone.remove();
    }.bind(this));

    return this;
};