/**
 * @class
 * @constructor
 */
Gui.Database.Controller.Fanarts = function () {
};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Database.Controller.Fanarts.prototype = new VDRest.Abstract.Controller();

/**
 * @type {String}
 */
Gui.Database.Controller.Fanarts.prototype.cacheKey = 'id';

/**
 * initialize view
 */
Gui.Database.Controller.Fanarts.prototype.init = function () {

    this.view = this.module.getView('Fanarts', this.data);
    this.view.setParentView(this.data.parent.view);
    this.initBackendAndDispatch()
};

/**
 * initialize backend, call dispatcher
 */
Gui.Database.Controller.Fanarts.prototype.initBackendAndDispatch = function () {

    this.backend = this.module.backend.getModel('Images.Image', this.data.id + '_fanart_collage');
    this.backend.onload = function (fanart) {
        if (!fanart.hasData('data_url')) {
            this.generateFanart();
        } else {
            this.view.setData('data_url', fanart.getData('data_url'));
        }
        this.dispatchView();
    }.bind(this);
};

/**
 * initialize view
 */
Gui.Database.Controller.Fanarts.prototype.generateFanart = function () {

    var me = this,
        backendType = this.data.id + '_fanart_collage',
        fanartModel = this.module.backend.getModel('Images.Image', backendType);
    this.module.getModel('Fanart').createFanartCollage(this.data.type, fanartModel, function () {
        me.view
            .setData('data_url', fanartModel.getData('data_url'))
            .updateImage();

    });
};
