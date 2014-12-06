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

    this.tiles = [];

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );
    this.initFanarts();
};

/**
 * initialize view
 */
Gui.Database.Controller.Default.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    setTimeout(function () {
        this.initTouchSlider();
    }.bind(this), 200);
};

/**
 * initialize fanart
 */
Gui.Database.Controller.Default.prototype.initFanarts = function () {

    this.tiles.push(this.module.getController('Fanart', {
        "id": "movies",
        "header": "Movies",
        "type": "movies",
        "parent": this
    }));
    this.tiles.push(this.module.getController('Fanart', {
        "id": "shows",
        "header": "TV-Shows",
        "type": "shows",
        "parent": this
    }));

    return this;
};

/**
 * initialize slider
 */
Gui.Database.Controller.Default.prototype.initTouchSlider = function () {

    var wrapper = document.querySelector('#viewport');

    new TouchMove.Slide({
        "wrapper" : wrapper,
        "sliderClassName" : 'fanart-slider',
        "allowedOrientations" : ['landscape']
    });

    return this;
};
