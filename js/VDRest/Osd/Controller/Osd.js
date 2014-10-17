
VDRest.Osd.Controller.Osd = function () {};

VDRest.Osd.Controller.Osd.prototype = new VDRest.Abstract.Controller();

VDRest.Osd.Controller.Osd.prototype.init = function () {

    this.module.getModel('Osd').initOsd();
};