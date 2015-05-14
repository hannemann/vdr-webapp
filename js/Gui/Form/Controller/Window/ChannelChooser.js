/**
 * @class
 * @constructor
 */
Gui.Form.Controller.Window.ChannelChooser = function () {};

/**
 * @type {Gui.Form.Controller.Window.Select}
 */
Gui.Form.Controller.Window.ChannelChooser.prototype = new Gui.Form.Controller.Window.Select();

/**
 * retrieve channels, initialize view
 */
Gui.Form.Controller.Window.ChannelChooser.prototype.init = function () {

    this.eventPrefix = 'window.channelChooser';

    this.view = this.module.getView('Window.ChannelChooser', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};
