Gui.Form.View.Abstract = function () {};

Gui.Form.View.Abstract.prototype = new VDRest.Abstract.View();

Gui.Form.View.Abstract.prototype.init = function () {

    this.node = $('<form>');

    this.categories = {};
};

/**
 * render dom
 */
Gui.Form.View.Abstract.prototype.render = function () {

    this.prepareFields();

    this.renderCategories();

    if (this.data.hasSubmit) {

        this.addSubmit();
    }

    this.node.appendTo(this.data.parentView.node);
};

/**
 * render buttons
 */
Gui.Form.View.Abstract.prototype.addSubmit = function () {


};

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

};

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
};

Gui.Form.View.Abstract.prototype.getBoolean = function (id, field) {

    this.decorateField(id, field);

    field.gui.attr('type', 'checkbox').prop('checked', field.getValue());

    field.dom.append(field.gui);
};

Gui.Form.View.Abstract.prototype.getNumber = function (id, field) {

    this.decorateField(id, field);

    field.gui.attr('type', 'number');

    field.dom.append(field.gui);
};

Gui.Form.View.Abstract.prototype.getString = function (id, field) {

    this.decorateField(id, field);

    field.gui.attr('type', 'text');

    field.dom.append(field.gui);
};

Gui.Form.View.Abstract.prototype.getEnum = function (id, field) {

    var values = field.values, selected;

    if ("function" === typeof values) {

        values = values();

    }

    selected = field.getValue();

    this.decorateField(id, field);

    field.gui
        .attr('type', 'text')
        .val(values[selected].label);

    field.dom.append(field.gui);
};

Gui.Form.View.Abstract.prototype.decorateField = function (id, field) {

    field.gui = $('<input name="' + (field.name ? field.name : id) + '">')
        .attr('readonly', true)
        .val((field.value ? field.value : field.getValue()));

    field.dom = $('<label id="' + id + '" class="clearer text">');
    $('<span>').text(field.label).appendTo(field.dom);

    if (field.hasOwnProperty('info')) {

        $('<span class="info">').text(field.info).appendTo(field.dom);
    }

    field.disabled = false;

    if ("undefined" !== typeof field.depends) {

        if (!this.data.fields[field.depends].getValue()) {

            field.dom.addClass('disabled');
            field.disabled = true;
        }
    }

    return field;
};

Gui.Form.View.Abstract.prototype.addToCategory = function (cat, field) {

    this.getCategory(cat).append(field.dom);
};

Gui.Form.View.Abstract.prototype.getCategory = function (cat) {

    if ("undefined" === typeof this.categories[cat]) {

        this.categories[cat] = $(
            '<div class="category category-'
            + cat
            + '"><h2>'
            + this.data.catConfig[cat].label
            + '</h2></div>'
        );
    }

    return this.categories[cat];
};

Gui.Form.View.Abstract.prototype.renderCategories = function () {

    var i;

    for (i in this.categories) {

        if (this.categories.hasOwnProperty(i)) {

            this.categories[i].appendTo(this.node);
        }
    }
};
