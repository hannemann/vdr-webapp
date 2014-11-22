/**
 * @class
 * @constructor
 */
Gui.Database.Controller.Default = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Database.Controller.Default.prototype = new VDRest.Abstract.Controller();

/**
 * initialize view
 */
Gui.Database.Controller.Default.prototype.init = function () {

    this.view = this.module.getView('Default', this.data);

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );
};

/**
 * initialize view
 */
Gui.Database.Controller.Default.prototype.dispatchView = function () {

    if (!this.view.hasFanarts) {
        this.initFanarts();
    } else {
        this.view.addFanarts();
    }

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

};

/**
 * initialize view
 */
Gui.Database.Controller.Default.prototype.generateFanart = function (type) {

    var me = this, m;

    type = type + '_fanart_collage';
    m = this.module.backend.getModel('Images.Image', type);
    this.module.getModel('Fanart').createFanartCollage(type, m, function () {
        me.view.setData(m.id, m.getData('data_url'));
        me.view.updateFanart(type);
    });
};

/**
 * initialize fanart
 */
Gui.Database.Controller.Default.prototype.initFanarts = function () {

    var fanarts = [
            this.module.backend.getModel('Images.Image', 'movies_fanart_collage'),
            this.module.backend.getModel('Images.Image', 'shows_fanart_collage')
        ],
        view = this.view, x = 0;

    fanarts.forEach(function (fanart) {
        fanart.onload = function (f) {
            view.setData(f.id, f.getData('data_url'));
            ++x == fanarts.length && view.addFanarts.call(view);
            view.hasFanarts = true;
        };
    });
};
