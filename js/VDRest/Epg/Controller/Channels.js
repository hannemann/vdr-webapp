
VDRest.Epg.Controller.Channels = function () {};

VDRest.Epg.Controller.Channels.prototype = new VDRest.Abstract.Controller();

VDRest.Epg.Controller.Channels.prototype.init = function () {

    this.module.getModel('Channels').initChannels();
};
