/**
 * @class
 * @constructor
 */
Gui.Database.Controller.List = function () {
};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Database.Controller.List.prototype = new VDRest.Abstract.Controller();

/**
 * bypass caching mechanism
 */
Gui.Database.Controller.List.prototype.bypassCache = true;

/**
 * retrieve collection model
 * @param {String} type
 */
Gui.Database.Controller.List.prototype.getCollection = function (type) {

    this.collection = this.module.backend.getModel(type);
    this.view.data.collection = this.collection;
};

/**
 * init view
 */
Gui.Database.Controller.List.prototype.init = function () {

    this.view = this.module.getView(this.id);

    this.getCollection(this.id);
};

/**
 * dispatch view
 * @param {Gui.Window.View.Abstract} parentView
 */
Gui.Database.Controller.List.prototype.dispatchView = function (parentView) {

    this.view.setParentView({
        "node": parentView.body
    });

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.collection.each(this.dispatchItem.bind(this));
};

/**
 * dispatch item
 * @param {VDRest.Database.Model.Item} item
 */
Gui.Database.Controller.List.prototype.dispatchItem = function (item) {

    var sing = this.id.replace(/s$/, '');

    this.module.getController(
        'List.' + sing,
        {"parent": this, "media": item, "type": sing}
    ).dispatchView();
};
