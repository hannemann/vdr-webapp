
Epg.Controller.Channels = function () {};

Epg.Controller.Channels.prototype = new Abstract.Controller();

Epg.Controller.Channels.prototype.init = function () {

    this.module.getModel('Channels').initChannels();
};
