/**
 * @constructor
 */
Gui.Video.View.Player.Controls.Osd.TimeLine.Cut.Mark = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Video.View.Player.Controls.Osd.TimeLine.Cut.Mark.prototype = new VDRest.Abstract.View();

/**
 * @type {boolean}
 */
Gui.Video.View.Player.Controls.Osd.TimeLine.Cut.Mark.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Video.View.Player.Controls.Osd.TimeLine.Cut.Mark.prototype.init = function () {

    this.player = this.data.parent.player;
    this.node = $('<div class="cutting-mark">');
};

/**
 * render
 */
Gui.Video.View.Player.Controls.Osd.TimeLine.Cut.Mark.prototype.render = function () {

    this.node.css({
        "left" : this.data.position
    });
    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * set mark width
 * @param {Number} endPos
 */
Gui.Video.View.Player.Controls.Osd.TimeLine.Cut.Mark.prototype.setWidth = function (endPos) {

    var right = '1px';

    if (endPos) {
        right = (100 - endPos) + '%';
    }

    this.node.css({
        "width" : "auto",
        "right" : right
    });
};
