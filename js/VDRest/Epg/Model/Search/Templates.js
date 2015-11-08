/**
 * @prperty {VDRest.EpgSearch.Model.List.SearchTimer.Resource} resource
 * @constructor
 */
VDRest.Epg.Model.Search.Templates = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Epg.Model.Search.Templates.prototype = new VDRest.Abstract.Model();

/**
 * @type {string}
 */
VDRest.Epg.Model.Search.Templates.prototype.resourceModel = 'Search.Templates.Template';

/**
 * initialize data
 */
VDRest.Epg.Model.Search.Templates.prototype.initData = function () {

    this.resource = this.module.getResource(this.resourceModel);

    VDRest.Lib.Object.prototype.initData.call(
        this,
        this.resource.getCollection()
    );
};

/**
 * save given searchtimer as template
 * @param {VDRest.EpgSearch.Model.List.SearchTimer} timer
 * @param {string} name
 */
VDRest.Epg.Model.Search.Templates.prototype.saveAsTemplate = function (timer, name) {

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
 * save given template
 * @param {searchTimerData} template
 * @param {string} name
 */
VDRest.Epg.Model.Search.Templates.prototype.saveTemplate = function (template, name) {

    this.setData(name, template);
    this.save();
};
/**
 * retrieve template by name
 * @param {string} name
 * @returns {*}
 */
VDRest.Epg.Model.Search.Templates.prototype.getTemplate = function (name) {

    return this.getData(name);
};

/**
 * delete template with given name
 * @param {string} name
 */
VDRest.Epg.Model.Search.Templates.prototype.deleteTemplate = function (name) {

    var data = this.getData();

    delete data[name];
    this.save();
};

/**
 * save templates
 */
VDRest.Epg.Model.Search.Templates.prototype.save = function () {

    this.resource.save(this.getData());
};
