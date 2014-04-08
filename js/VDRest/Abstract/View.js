/**
 * @class
 * @constructor
 * @var {jQuery} node
 */
VDRest.Abstract.View = function () {};

/**
 * prototype
 * @type {VDRest.Lib.Object}
 */
VDRest.Abstract.View.prototype = new VDRest.Lib.Object();

/**
 * set parent view
 * @param parentView
 * @returns {VDRest.Abstract.View}
 */
VDRest.Abstract.View.prototype.setParentView = function (parentView) {

    this.parentView = parentView;

    return this;
};

/**
 * append node to parentNode
 */
VDRest.Abstract.View.prototype.render = function () {

    this.node.appendTo(this.parentView.node);
};