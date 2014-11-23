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
};

/**
 * initialize view
 */
Gui.Database.Controller.Default.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    this.initFanarts().initTouchSlider();
};

/**
 * initialize fanart
 */
Gui.Database.Controller.Default.prototype.initFanarts = function () {

    this.tiles.push(this.module.getController('Fanarts', {
        "id": "movies",
        "header": "Movies",
        "type": "movies",
        "parent": this
    }));
    this.tiles.push(this.module.getController('Fanarts', {
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

    new VDRest.Lib.TouchSlide({
        "slide": this.view.node.get(0),
        "borders": {
            "x": {
                "min": function () {
                    return -window.innerWidth;
                },
                "max": function () {
                    return window.innerWidth * (this.tiles.length - 1);
                }.bind(this)
            },
            "y": {
                "min": 1,
                "max": 1
            }
        },
        "allowedOrientations": ['landscape'],
        "allowedDirections": ['x'],
        "maxDelta": 50,
        "tiles": {
            "x": this.tiles.length,
            "y": 1
        }
    });

    return this;
};
