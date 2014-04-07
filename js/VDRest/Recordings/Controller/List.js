
VDRest.Recordings.Controller.List = function () {};

VDRest.Recordings.Controller.List.prototype = new VDRest.Abstract.Controller();

VDRest.Recordings.Controller.List.prototype.init = function () {

    this.module.getModel('List').initList();
};