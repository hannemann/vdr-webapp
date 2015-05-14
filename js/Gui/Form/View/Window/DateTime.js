/**
 * @class
 * @constructor
 * @property {{}|Function} values
 */
Gui.Form.View.Window.DateTime = function () {
};

/**
 * @type {Gui.Form.View.Window.Input}
 */
Gui.Form.View.Window.DateTime.prototype = new Gui.Form.View.Window.Input();

/**
 * @type {boolean}
 */
Gui.Form.View.Window.DateTime.prototype.isModal = true;

/**
 * decorate and render
 */
Gui.Form.View.Window.DateTime.prototype.render = function () {

    this.header = $('<div class="header">').appendTo(this.body);

    this.valuesWrapper = $('<div class="wrapper">').appendTo(this.body);

    this.setHeader().addClasses().addSelects().addButtons();

    this.node.addClass('date-time');

    Gui.Window.View.Abstract.prototype.render.call(this);
};

/**
 * add header text
 * @returns {Gui.Form.View.Window.DateTime}
 */
Gui.Form.View.Window.DateTime.prototype.setHeader = function () {

    this.header.text(VDRest.app.translate(this.data.label));

    return this;
};

/**
 * add selects
 * @returns {Gui.Form.View.Window.DateTime}
 */
Gui.Form.View.Window.DateTime.prototype.addSelects = function () {

    var format = this.parseFormat(),
        template = this.data.format,
        value = this.data.gui.val(),
        selected,
        reg;

    format.forEach(function (part) {

        reg = new RegExp(part);

        switch (part) {
            case '%Y':
                selected = value.match(this.supported.Y.reg);
                if (selected) {
                    selected = selected[0];
                }
                value = value.replace(this.supported.Y.reg, '%Y');
                template = template.replace(reg, this.getYearSelect(selected).html());
                break;
            case '%F':
                selected = value.match(this.supported.F.reg);
                if (selected) {
                    selected = selected[0];
                }
                value = value.replace(this.supported.F.reg, '%F');
                template = template.replace(reg, this.getFullMonthSelect(selected).html());
                break;
            case '%m':
                selected = value.match(this.supported.m.reg);
                if (selected) {
                    selected = selected[0];
                }
                value = value.replace(this.supported.m.reg, '%m');
                template = template.replace(reg, this.getMonthSelect(selected).html());
                break;
            case '%d':
                selected = value.match(this.supported.d.reg);
                if (selected) {
                    selected = selected[0];
                }
                value = value.replace(this.supported.d.reg, '%d');
                template = template.replace(reg, this.getDaySelect(selected).html());
                break;
            case '%H':
                selected = value.match(this.supported.H.reg);
                if (selected) {
                    selected = selected[0];
                }
                value = value.replace(this.supported.H.reg, '%H');
                template = template.replace(reg, this.getHourSelect(selected).html());
                break;
            case '%i':
                selected = value.match(this.supported.i.reg);
                if (selected) {
                    selected = selected[0];
                }
                value = value.replace(this.supported.i.reg, '%i');
                template = template.replace(reg, this.getMinuteSelect(selected).html());
                break;
            default:
                break;
        }
    }.bind(this));

    this.body.html(template);

    if (this.data.showInfo) {
        this.body.append(this.data.dom.find('.info').clone());
    }

    return this;
};

/**
 * parse format
 * @return {[]}
 */
Gui.Form.View.Window.DateTime.prototype.parseFormat = function () {

    var reg = new RegExp('%[' + this.supported.all + ']', 'g');

    return this.data.format.match(reg);
};

/**
 * retrieve year select
 * @return {jQuery}
 */
Gui.Form.View.Window.DateTime.prototype.getYearSelect = function (selected) {

    var d = new Date(), y = d.getFullYear(), x = 0, dom = $('<div>'), o;

    this.year = $('<select class="year">');

    do {
        o = $('<option>');

        if (parseInt(selected, 10) === y) {
            o.attr('selected', 'selected');
        }

        o.attr('value', y)
            .text(y)
            .appendTo(this.year);
        y++;
        x++;
    } while (x <= 5);

    dom.append(this.year);

    return dom;
};

/**
 * retrieve month select
 * @return {jQuery}
 */
Gui.Form.View.Window.DateTime.prototype.getFullMonthSelect = function (selected) {

    var y = 0, dom = $('<div>'), o,
        monthNames = VDRest.helper.monthNames();

    this.month = $('<select class="monthname">');

    do {
        o = $('<option>');

        if (selected === monthNames[y]) {
            o.attr('selected', 'selected');
        }

        o.attr('value', VDRest.app.translate(monthNames[y]))
            .text(VDRest.app.translate(monthNames[y]))
            .appendTo(this.month);
        y++;
    } while (y < 12);

    dom.append(this.month);

    return dom;
};

/**
 * retrieve month select
 * @return {jQuery}
 */
Gui.Form.View.Window.DateTime.prototype.getMonthSelect = function (selected) {

    var y = 0, dom = $('<div>'), o;

    this.month = $('<select class="month">');

    do {
        o = $('<option>');

        if (parseInt(selected, 10) === y) {
            o.attr('selected', 'selected');
        }

        o.attr('value', VDRest.helper.pad(y, 2))
            .text(VDRest.helper.pad(y, 2))
            .appendTo(this.month);
        y++;
    } while (y < 12);

    dom.append(this.month);

    return dom;
};

/**
 * retrieve day select
 * @return {jQuery}
 */
Gui.Form.View.Window.DateTime.prototype.getDaySelect = function (selected) {

    var y = 1, dom = $('<div>'), o;

    this.day = $('<select class="day">');

    do {
        o = $('<option>');

        if (parseInt(selected, 10) === y) {
            o.attr('selected', 'selected');
        }

        o.attr('value', VDRest.helper.pad(y, 2))
            .text(VDRest.helper.pad(y, 2))
            .appendTo(this.day);
        y++;
    } while (y <= 31);

    dom.append(this.day);

    return dom;
};

/**
 * retrieve hour select
 * @return {jQuery}
 */
Gui.Form.View.Window.DateTime.prototype.getHourSelect = function (selected) {

    var y = 0, dom = $('<div>'), o;

    this.hour = $('<select class="hour">');

    do {
        o = $('<option>');

        if (parseInt(selected, 10) === y) {
            o.attr('selected', 'selected');
        }

        o.attr('value', VDRest.helper.pad(y, 2))
            .text(VDRest.helper.pad(y, 2))
            .appendTo(this.hour);
        y++;
    } while (y < 24);

    dom.append(this.hour);

    return dom;
};

/**
 * retrieve minute select
 * @return {jQuery}
 */
Gui.Form.View.Window.DateTime.prototype.getMinuteSelect = function (selected) {

    var y = 0, dom = $('<div>'), o;

    this.minute = $('<select class="minute">');

    do {
        o = $('<option>');

        if (parseInt(selected, 10) === y) {
            o.attr('selected', 'selected');
        }

        o.attr('value', VDRest.helper.pad(y, 2))
            .text(VDRest.helper.pad(y, 2))
            .appendTo(this.minute);
        y++;
    } while (y < 60);

    dom.append(this.minute);

    return dom;
};