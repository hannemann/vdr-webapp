VDRest.SearchTimer.Model.Templates = function () {};

VDRest.SearchTimer.Model.Templates.prototype = new VDRest.Abstract.Model();

VDRest.SearchTimer.Model.Templates.prototype.initData = function () {

    this.resource = this.module.getResource('Templates.Template');

    VDRest.Lib.Object.prototype.initData.call(
        this,
        this.resource.getCollection()
    );
};

VDRest.SearchTimer.Model.Templates.prototype.saveAsTemplate = function (timer, name) {

    var template = VDRest.SearchTimer.Model.List.SearchTimer.prototype.getInitData(),
        i;

    timer = timer.getData();

    for (i in timer) {
        if (timer.hasOwnProperty(i)) {
            if (i !== 'id' && i !== 'search') {
                template[i] = timer[i];
            }
        }
    }
    this.setData(name, template);
    this.resource.save(this.getData());
};

VDRest.SearchTimer.Model.Templates.prototype.getTemplate = function (name) {

    return this.getData(name);
};
