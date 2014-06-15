VDRest.SearchTimer.Controller.List = function () {};

VDRest.SearchTimer.Controller.List.prototype = new VDRest.Abstract.Controller();

VDRest.SearchTimer.Controller.List.prototype.init = function () {

    this.module.getModel('List').initList();
};