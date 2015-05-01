/**
 * @class
 * @constructor
 * @property {{fields: {}}} data
 */
Gui.Form.View.Abstract = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Form.View.Abstract.prototype = new VDRest.Abstract.View();

/**
 * initialize node and categories
 */
Gui.Form.View.Abstract.prototype.init = function () {

    this.node = $('<form>');

    this.categories = {};
};

/**
 * render dom
 */
Gui.Form.View.Abstract.prototype.render = function () {

    this.addClasses()
        .prepareFields()
        .renderCategories();

    if (this.data.hasSubmit) {

        this.addSubmit();
    }

    if (this.data.owner && this.data.reference) {

        this.data.owner[this.data.reference] = this.data.fields;
    }

    this.node.appendTo(this.data.parentView.node);
};

/**
 * render buttons
 */
Gui.Form.View.Abstract.prototype.addClasses = function () {

    if (this.data.className) {
        this.node.addClass(this.data.className);
    }
    return this;
};

/**
 * render buttons
 */
Gui.Form.View.Abstract.prototype.addSubmit = function () {

    return this;
};

/**
 * prepare data fields, add to category
 */
Gui.Form.View.Abstract.prototype.prepareFields = function () {

    var i;

    for (i in this.data.fields) {

        if (this.data.fields.hasOwnProperty(i)) {

            this.prepareField(i, this.data.fields[i]);

            if (this.data.fields[i].dom) {

                this.addToCategory(this.data.fields[i].category, this.data.fields[i]);
            }
        }
    }

    return this;
};

/**
 * get dom according to type of data
 * @param {string} id
 * @param {{}} field
 */
Gui.Form.View.Abstract.prototype.prepareField = function (id, field) {

    if ("boolean" === field.type) {

        this.getBoolean(id, field);
    }

    if ("number" === field.type) {

        this.getNumber(id, field);
    }

    if ("string" === field.type) {

        this.getString(id, field);
    }

    if ("enum" === field.type) {

        this.getEnum(id, field);
    }

    if ("channel" === field.type) {

        this.getChannel(id, field);
    }

    if ("directory" === field.type) {

        this.getDirectory(id, field);
    }

    if ("datetime" === field.type) {

        this.getDateTime(id, field);
    }

    if ("info" === field.type) {

        this.getInfo(id, field);
    }

    if ("combobox" === field.type) {

        this.getComboBox(id, field);
    }
};

/**
 * set type checkbox
 * @param {string} id
 * @param {{}} field
 */
Gui.Form.View.Abstract.prototype.getBoolean = function (id, field) {

    this.decorateField(id, field);

    field.gui.attr('type', 'checkbox').prop('checked', field.checked);

    field.dom.addClass('form-field-boolean').append(field.gui);
};

/**
 * set typ number
 * @param {string} id
 * @param {{}} field
 */
Gui.Form.View.Abstract.prototype.getNumber = function (id, field) {

    this.decorateField(id, field);

    field.gui.attr('type', 'number');

    field.dom.append(field.gui);
};

/**
 * set type text
 * @param {string} id
 * @param {{}} field
 */
Gui.Form.View.Abstract.prototype.getString = function (id, field) {

    this.decorateField(id, field);

    field.gui.attr('type', 'text');

    field.dom.append(field.gui);
};

/**
 * set type text, add value
 * @param {string} id
 * @param {{}} field
 */
Gui.Form.View.Abstract.prototype.getEnum = function (id, field) {

    var selected = field.getValue(), val;

    this.decorateField(id, field);

    if (field.multiselect) {
        val = [];
        if (selected instanceof Array) {
            selected.forEach(function (s) {
                val.push(s.label);
            });
        }
        val = val.join(', ');
    } else {
        val = VDRest.app.translate(selected.label)
    }

    field.gui
        .attr('type', 'text')
        .val(val);

    field.dom.append(field.gui);
};

/**
 * set type text, add value
 * @param {string} id
 * @param {{}} field
 */
Gui.Form.View.Abstract.prototype.getComboBox = function (id, field) {

    this.decorateField(id, field);

    field.gui
        .attr('type', 'text')
        .val(field.text_value);

    field.dom.append(field.gui);
};

/**
 * set type text
 * @param {string} id
 * @param {{values: {}}} field
 */
Gui.Form.View.Abstract.prototype.getChannel = function (id, field) {

    var selected, values = [], i, l, label;

    field.values = this.getChannelValues();
    this.setSelectedChannels(field, field.selected);

    if ("function" === typeof field.getValuesAfter) {
        field.getValuesAfter();
    }

    selected = field.getValue();

    this.decorateField(id, field);

    if (field.multiselect) {

        i = 0;
        l = selected.length;

        for (i;i<l;i++) {

            values.push(VDRest.app.translate(selected[i].label));
        }
        label = values.join(', ');
    } else {
        label = VDRest.app.translate(selected.label);
    }

    field.gui.attr('type', 'text')
        .val(label);

    field.dom.append(field.gui);
};

/**
 * set type text
 * @param {string} id
 * @param {{}} field
 */
Gui.Form.View.Abstract.prototype.getDirectory = function (id, field) {

    this.decorateField(id, field);

    field.gui.attr('type', 'text');

    field.dom.append(field.gui);
};

/**
 * set type text
 * @param {string} id
 * @param {{}} field
 */
Gui.Form.View.Abstract.prototype.getDateTime = function (id, field) {

    this.decorateField(id, field);

    field.gui.attr('type', 'text');

    field.gui.val(field.getValue());

    field.dom.append(field.gui);
};

/**
 * add button for info window
 * @param {string} id
 * @param {{}} field
 */
Gui.Form.View.Abstract.prototype.getInfo = function (id, field) {

    this.decorateField(id, field);

    field.gui = undefined;
};

/**
 * decorate data with dom according to type
 * @param {string} id
 * @param {{}} field
 * @returns {*}
 */
Gui.Form.View.Abstract.prototype.decorateField = function (id, field) {

    field.gui = $('<input name="' + (field.name ? field.name : id) + '">')
        .attr('readonly', true)
        .val((field.value ? field.value : ''));

    field.dom = $('<label id="' + id + '" class="clearer text">');
    $('<span>').html(VDRest.app.translate(field.label)).appendTo(field.dom);

    if (field.hasOwnProperty('info')) {

        $('<span class="info">').text(VDRest.app.translate(field.info)).appendTo(field.dom);
    }

    field.disabled = false;

    if ("undefined" !== typeof field.depends) {

        if (this.isDisabled(field)) {

            field.dom.addClass('disabled');
            field.disabled = true;
        }
    }

    return field;
};

/**
 * check if field has to be disabled
 * @param {{depends: {}|string}} field
 * @return {boolean}
 */
Gui.Form.View.Abstract.prototype.isDisabled = function (field) {

    var i;

    if ('string' === typeof field.depends && !this.data.fields[field.depends].getValue()) {
        return true;
    } else {
        for (i in field.depends) {
            if (field.depends.hasOwnProperty(i) && this.data.fields.hasOwnProperty(i)) {

                if ('enum' === this.data.fields[i].type || 'channel' === this.data.fields[i].type) {
                    if (field.depends[i] instanceof Array) {
                        if (field.depends[i].indexOf(this.data.fields[i].getValue().value) < 0) {
                            return true;
                        }
                    } else if (this.data.fields[i].getValue().value !== field.depends[i]) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
};

/**
 * add field to category
 * @param {string} cat
 * @param {{}} field
 */
Gui.Form.View.Abstract.prototype.addToCategory = function (cat, field) {

    this.getCategory(cat).append(field.dom);
};

/**
 * retriev category by name
 * @param {string} cat
 * @returns {*}
 */
Gui.Form.View.Abstract.prototype.getCategory = function (cat) {

    if ("undefined" === typeof this.categories[cat]) {

        this.categories[cat] = $(
            '<div class="category category-'
            + cat
            + '"><h2>'
            + VDRest.app.translate(this.data.catConfig[cat].label)
            + '</h2></div>'
        );
    }

    return this.categories[cat];
};

/**
 * add categories to node
 */
Gui.Form.View.Abstract.prototype.renderCategories = function () {

    var i;

    for (i in this.categories) {

        if (this.categories.hasOwnProperty(i)) {

            this.categories[i].appendTo(this.node);
        }
    }

    return this;
};

Gui.Form.View.Abstract.prototype.getChannelValues = function () {

    var channels = VDRest.app.getModule('VDRest.Epg').getModel('Channels').collection,
        values = {}, i = 0, l;

    l = channels.length;

    for (i; i < l; i++) {

        values[channels[i].data.channel_id] = {
            "label": channels[i].data.name,
            "value": channels[i].data.channel_id,
            "index": i
        };


        if (channels[i].data.image) {

            values[channels[i].data.channel_id].image = channels[i].data.image;
        }
    }

    return values;
};

Gui.Form.View.Abstract.prototype.setSelectedChannels = function (field, selected) {

    var i;

    if ("function" === typeof selected) {
        selected = selected();
    } else if ("string" === typeof selected.forEach) {
        selected = [selected];
    }

    for (i in field.values) {

        if (field.values.hasOwnProperty(i)) {
            field.values[i].selected = selected.indexOf(i) > -1;
        }
    }
};
