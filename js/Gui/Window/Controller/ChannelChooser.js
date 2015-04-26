/**
 * @class
 * @constructor
 */
Gui.Window.Controller.ChannelChooser = function () {};

/**
 * @type {Gui.Window.Controller.Select}
 */
Gui.Window.Controller.ChannelChooser.prototype = new Gui.Window.Controller.Select();

/**
 * retrieve channels, initialize view
 */
Gui.Window.Controller.ChannelChooser.prototype.init = function () {

    this.eventPrefix = 'window.channelChooser';

    this.view = this.module.getView('ChannelChooser', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};
