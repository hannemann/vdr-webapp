Event.Window.View = function (event) {

    this.event = event;

};

Event.Window.View.prototype = new Gui.Window.View();

Event.Window.View.constructor = Event.Window.View;

/**
 * retrieve offsets of caller
 * @return {Object}
 */
Event.Window.View.prototype.getDefaultDimension = function () {

    var dom = this.event.getData('dom'),
        offset = dom.offset(), window = $(top);

    return {
        "top":offset.top+"px",
        "left":offset.left+"px",
        "right":window.width()-(offset.left+dom.width())+"px",
        "bottom":window.height()-(offset.top+dom.height())+"px"
    };
};
