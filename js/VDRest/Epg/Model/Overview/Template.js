/**
 * @constructor
 * @property {{}} data
 * @property {searchTimerData} data.search
 */
VDRest.Epg.Model.Overview.Template = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Epg.Model.Overview.Template.prototype = new VDRest.Abstract.Model();

/**
 * storage
 * @type {VDRest.Lib.LocalStorage}
 */
VDRest.Epg.Model.Overview.Template.prototype.storage = new VDRest.Lib.LocalStorage();

/**
 * name of template in storage
 * @type {string}
 */
VDRest.Epg.Model.Overview.Template.prototype.storageName = 'overview_search_template';

/**
 * @type {boolean}
 */
VDRest.Epg.Model.Overview.Template.prototype.hasTemplate = false;

/**
 * initialize
 */
VDRest.Epg.Model.Overview.Template.prototype.init = function () {

    var search;
    this.storage.init();

    search = this.storage.getItem(this.storageName);

    if (search) {
        this.hasTemplate = true;
        this.setData('search', search);
    }
};

/**
 * @param {searchTimerData} template
 */
VDRest.Epg.Model.Overview.Template.prototype.save = function (template) {

    template.id = -1;
    this.storage.setItem(this.storageName, JSON.stringify(template));
};

/**
 * @returns {searchTimerData}
 */
VDRest.Epg.Model.Overview.Template.prototype.getTemplate = function () {

    return JSON.parse(this.getData('search'));
};
