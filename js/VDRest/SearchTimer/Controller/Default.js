VDRest.SearchTimer.Controller.Default = function () {
};

VDRest.SearchTimer.Controller.Default.prototype = new VDRest.Abstract.Controller();

VDRest.SearchTimer.Controller.Default.prototype.init = function () {

    this.module.getModel('ChannelGroups').initList();
    this.module.getModel('ExtEPGInfoList').initList();
    this.module.getModel('Blacklists').initList();
    this.module.getModel('RecordingDirs').initList();
    //this.module.getModel('List').initList();
};