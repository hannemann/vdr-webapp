/**
 * SearchTimer Helper
 * @constructor
 * @property {VDRest.SearchTimer.Model.Templates} dataModel
 */
Gui.SearchTimer.Helper.Templates = function () {};

/**
 * @type {VDRest.Abstract.Helper}
 */
Gui.SearchTimer.Helper.Templates.prototype = new Gui.EpgSearch.Helper.Templates();

/**
 * retrieve templates model
 * @returns {VDRest.SearchTimer.Model.Templates}
 */
Gui.SearchTimer.Helper.Templates.prototype.getTemplates = function () {

    if (!this.dataModel) {
        this.dataModel = VDRest.app.getModule('VDRest.SearchTimer')
            .getModel('Templates');
    }

    return this.dataModel;
};
