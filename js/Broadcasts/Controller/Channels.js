
Broadcasts.Controller.Channels = function () {};

Broadcasts.Controller.Channels.prototype = new Abstract.Controller();

Broadcasts.Controller.Channels.prototype.init = function () {

    this.module.getModel('Channels').initChannels();
};
