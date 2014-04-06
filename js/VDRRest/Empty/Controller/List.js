
VDRest.Timer.Controller.List = function () {};

VDRest.Timer.Controller.List.prototype = new VDRest.Abstract.Controller();

VDRest.Timer.Controller.List.prototype.init = function () {

    this.module.getModel('List').initList();
};