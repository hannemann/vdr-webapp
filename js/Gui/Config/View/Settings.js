Gui.Config.View.Settings = function () {};

Gui.Config.View.Settings.prototype = new VDRest.Abstract.View();

Gui.Config.View.Settings.prototype.init = function () {

    this.node = $('<form id="settings">');

    this.categories = {};
};

Gui.Config.View.Settings.prototype.render = function () {

    this.prepareFields();

    this.renderCategories();

    VDRest.Abstract.View.prototype.render.call(this);
};

Gui.Config.View.Settings.prototype.prepareFields = function () {

    var i;

    for (i in this.fields) {

        if (this.fields.hasOwnProperty(i)) {

            this.prepareField(i, this.fields[i]);

            if (this.fields[i].dom) {

                this.addToCategory(this.fields[i].category, this.fields[i]);
            }
        }
    }

};

Gui.Config.View.Settings.prototype.prepareField = function (id, field) {

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

Gui.Config.View.Settings.prototype.getBoolean = function (id, field) {

    this.decorateField(id, field);

    field.gui.attr('type', 'checkbox').prop('checked', field.getValue());

    field.dom.append(field.gui);
};

Gui.Config.View.Settings.prototype.getNumber = function (id, field) {

    this.decorateField(id, field);

    field.gui.attr('type', 'number');

    field.dom.append(field.gui);
};

Gui.Config.View.Settings.prototype.getString = function (id, field) {

    this.decorateField(id, field);

    field.gui.attr('type', 'text');

    field.dom.append(field.gui);
};

// TODO: Implement Enum
Gui.Config.View.Settings.prototype.getEnum = function (id, field) {

    var values = field.values, selected;

    if ("function" === typeof values) {

        values = values();

    }

    selected = VDRest.config.getItem(id);

    this.decorateField(id, field);

    field.gui
        .attr('type', 'text')
        .val(values[selected].label);

    field.dom.append(field.gui);
};

Gui.Config.View.Settings.prototype.decorateField = function (id, field) {

    field.gui = $('<input name="' + id + '">')
        .attr('readonly', true)
        .val(field.getValue());

    field.dom = $('<label id="' + id + '" class="clearer text">');
    $('<span>').text(field.label).appendTo(field.dom);

    if (field.hasOwnProperty('info')) {

        $('<span class="info">').text(field.info).appendTo(field.dom);
    }

    field.disabled = false;

    if ("undefined" !== typeof field.depends) {

        if (!this.fields[field.depends].getValue()) {

            field.dom.addClass('disabled');
            field.disabled = true;
        }
    }

    return field;
};

Gui.Config.View.Settings.prototype.addToCategory = function (cat, field) {

    this.getCategory(cat).append(field.dom);
};

Gui.Config.View.Settings.prototype.getCategory = function (cat) {

    if ("undefined" === typeof this.categories[cat]) {

        this.categories[cat] = $(
            '<div class="category category-'
            + cat
            + '"><h2>'
            + this.catConfig[cat].label
            + '</h2></div>'
        );
    }

    return this.categories[cat];
};

Gui.Config.View.Settings.prototype.renderCategories = function () {

    var i;

    for (i in this.categories) {

        if (this.categories.hasOwnProperty(i)) {

            this.categories[i].appendTo(this.node);
        }
    }
};
