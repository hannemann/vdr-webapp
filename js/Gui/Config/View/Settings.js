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

    var value = "true" === field.getter() ? true : false;

    field.gui = $('<input type="checkbox" name="' + id + '" value="1">')
        .prop('checked', value);

    field.dom = $('<label id="' + id + '" class="clearer boolean">')
        .text(field.label);

    if (field.hasOwnProperty('info')) {

        $('<span class="info">').text(field.info).appendTo(field.dom);
    }

    field.dom.append(field.gui);
};

Gui.Config.View.Settings.prototype.getNumber = function (id, field) {

    field.gui = $('<input type="number" name="' + id + '">')
        .attr('readonly', true)
        .val(field.getter());

    field.dom = $('<label id="' + id + '" class="clearer number">')
        .text(field.label);

    if (field.hasOwnProperty('info')) {

        $('<span class="info">').text(field.info).appendTo(field.dom);
    }

    field.dom.append(field.gui);
};

Gui.Config.View.Settings.prototype.getString = function (id, field) {

    field.gui = $('<input type="text" name="' + id + '">')
        .attr('readonly', true)
        .val(field.getter());

    field.dom = $('<label id="' + id + '" class="clearer text">')
        .text(field.label);

    if (field.hasOwnProperty('info')) {

        $('<span class="info">').text(field.info).appendTo(field.dom);
    }

    field.dom.append(field.gui);
};

// TODO: Implement Enum
Gui.Config.View.Settings.prototype.getEnum = function (id, field) {

    return false;
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
