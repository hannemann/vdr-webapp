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
 * retrieve collection model
 * @param {String} type
 */
Gui.Database.Controller.List.prototype.getCollection = function (type) {

    this.collection = this.module.backend.getModel(type);
    this.view.data.collection = this.collection;
};
