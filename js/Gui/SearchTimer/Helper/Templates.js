/**
 * SearchTimer Helper
 * @constructor
 * @property {VDRest.SearchTimer.Model.Templates} dataModel
 */
Gui.SearchTimer.Helper.Templates = function () {};

/**
 * @type {VDRest.Abstract.Helper}
 */
Gui.SearchTimer.Helper.Templates.prototype = new VDRest.Abstract.Helper();

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

/**
 * @private
 * @param {string} label
 * @param {boolean} withNone
 * @param {boolean} multiselect
 * @returns {{type: string, dom: (*|jQuery|HTMLElement), values: {}, value: string}}
 */
Gui.SearchTimer.Helper.Templates.prototype.getTemplateSelectData = function (label, withNone, multiselect) {

    var data, values = {}, i, templates = this.getTemplates().getData();

    if (withNone) {
        values['none'] = {
            "label" : VDRest.app.translate("No Template"),
            "value" : false,
            "selected" : true
        };
    }

    for (i in templates) {
        if (templates.hasOwnProperty(i)) {
            values[i] = {
                "label" : i,
                "value" : i,
                "translate" : false
            }
        }
    }

    data = {
        "type": "enum",
        "dom": $('<label class="clearer text">'),
        "values": values,
        "value" : ""
    };

    data.multiselect = multiselect === true;

    $('<span>').text(VDRest.app.translate(label)).appendTo(data.dom);

    data.gui = $('<input type="text" name="template">')
        .appendTo(data.dom);
    data.gui.val(data.value);

    return data;
};

/**
 * retrieve data to create single select with none
 * @param {string} label
 * @returns {{type: string, dom: (*|jQuery|HTMLElement), values: {}, value: string}}
 */
Gui.SearchTimer.Helper.Templates.prototype.getSingleSelectWithNone = function (label) {

    return this.getTemplateSelectData(label, true, false);
};

/**
 * retrieve multiselect data without none
 * @param label
 * @returns {{type: string, dom: (*|jQuery|HTMLElement), values: {}, value: string}}
 */
Gui.SearchTimer.Helper.Templates.prototype.getMultiSelect = function (label) {

    return this.getTemplateSelectData(label, false, true);
};

/**
 * @returns {boolean}
 */
Gui.SearchTimer.Helper.Templates.prototype.hasTemplates = function () {

    return this.getTemplates().length > 0;
};

/**
 * delete tamplates
 * @param {Array.<string>} names
 */
Gui.SearchTimer.Helper.Templates.prototype.deleteTemplates = function (names) {

    this.getTemplates();

    names.forEach(function (name) {
        this.dataModel.deleteTemplate(name);
    }.bind(this))
};