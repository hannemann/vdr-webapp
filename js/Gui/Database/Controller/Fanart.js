/**
 * @class
 * @constructor
 */
Gui.Database.Controller.Fanart = function () {
};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Database.Controller.Fanart.prototype = new VDRest.Abstract.Controller();

/**
 * @type {String}
 */
Gui.Database.Controller.Fanart.prototype.cacheKey = 'id';

/**
 * initialize view
 */
Gui.Database.Controller.Fanart.prototype.init = function () {

    this.view = this.module.getView('Fanart', this.data);
    this.view.setParentView(this.data.parent.view);
    this.initBackendAndDispatch()
};

/**
 * dispatch view
 */
Gui.Database.Controller.Fanart.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    this.addObserver();
};

/**
 * add event listeners
 */
Gui.Database.Controller.Fanart.prototype.addObserver = function () {

    this.view.node.on('click', this.handleClick.bind(this));
};

/**
 * remove event listeners
 */
Gui.Database.Controller.Fanart.prototype.removeObserver = function () {

    this.view.node.off('click');
};

Gui.Database.Controller.Fanart.prototype.handleClick = function () {

    console.log('Click');
};

/**
 * initialize backend, call dispatcher
 */
Gui.Database.Controller.Fanart.prototype.initBackendAndDispatch = function () {

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
 * generate Fanart
 */
Gui.Database.Controller.Fanart.prototype.generateFanart = function () {

    var me = this,
        backendType = this.data.id + '_fanart_collage',
        fanartModel = this.module.backend.getModel('Images.Image', backendType);

    this.view.addThrobber();

    this.module.getModel('Fanart').createFanartCollage(this.data.type, fanartModel, function () {
        me.view
            .setData('data_url', fanartModel.getData('data_url'))
            .updateImage();

        me.view.removeThrobber();
    });
};
