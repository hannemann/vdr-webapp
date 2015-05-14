/**
 * @prperty {VDRest.SearchTimer.Model.List.SearchTimer.Resource} resource
 * @constructor
 */
VDRest.SearchTimer.Model.Templates = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.SearchTimer.Model.Templates.prototype = new VDRest.Abstract.Model();

/**
 * initialize data
 */
VDRest.SearchTimer.Model.Templates.prototype.initData = function () {

    this.resource = this.module.getResource('Templates.Template');

    VDRest.Lib.Object.prototype.initData.call(
        this,
        this.resource.getCollection()
    );
};

/**
 * save given searchtimer as template
 * @param {VDRest.SearchTimer.Model.List.SearchTimer} timer
 * @param {string} name
 */
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
    this.save();
};

/**
 * retrieve template by name
 * @param {string} name
 * @returns {*}
 */
VDRest.SearchTimer.Model.Templates.prototype.getTemplate = function (name) {

    return this.getData(name);
};

/**
 * delete template with given name
 * @param {string} name
 */
VDRest.SearchTimer.Model.Templates.prototype.deleteTemplate = function (name) {

    var data = this.getData();

    delete data[name];
    this.save();
};

/**
 * save templates
 */
VDRest.SearchTimer.Model.Templates.prototype.save = function () {

    this.resource.save(this.getData());
};
