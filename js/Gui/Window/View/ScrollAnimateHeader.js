Gui.Window.View.ScrollAnimateHeader = function () {
};

Gui.Window.View.ScrollAnimateHeader.prototype = new Gui.Window.View.Abstract();

/**
 * add components, call render method
 */
Gui.Window.View.ScrollAnimateHeader.prototype.render = function () {

    this.node.addClass('scroll-animate-header');

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.scrollShiftWrapper = $('<div class="scroll-shift">').appendTo(this.header);

    this.scrollShiftShadow = $('<div class="scroll-shift-shadow">').appendTo(this.scrollShiftWrapper);
};

Gui.Window.View.ScrollAnimateHeader.prototype.canAnimateScroll = function () {

    return this.node[0].scrollHeight > this.parentView.node[0].offsetHeight && VDRest.helper.touchMoveCapable;
};
